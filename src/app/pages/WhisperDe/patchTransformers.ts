import type * as tfjs from "@xenova/transformers";

export async function patchTransformers(model: any) {
    if (!model || !model.model) throw new Error("Invalid model passed to patchTransformers");

    // Avoid double-patch
    if ((model as any).__hasGetDecoderEmbedding) return;
    (model as any).__hasGetDecoderEmbedding = true;

    // Avoid double-patch
    if ((model as any).__hasGetDecoderEmbedding) return;
    (model as any).__hasGetDecoderEmbedding = true;

    // Attach method to the instance
    (model as any).getDecoderEmbedding = async function (inputs: {
        encoder_hidden_states: any; // expected shape: [batch, seq_len, hidden_dim]
        decoder_input_ids: any; // expected shape: [batch, dec_seq_len]
    }) {
        // Run encoder if needed (if user passed raw audio/inputs they can call encoder separately)
        // Here we assume encoder_hidden_states is already the right tensor/array.


        // Some transformers.js model methods expect plain JS arrays or typed arrays depending on the implementation.
        // We'll pass through the values and rely on transformers.js to accept them.


        // Call decoder directly and ask for last_hidden_state
        // Many model implementations accept an options object like { encoder_hidden_states, input_ids, return_dict: true }
        const decoderArgs: any = {
            encoder_hidden_states: inputs.encoder_hidden_states,
            input_ids: inputs.decoder_input_ids,
            return_dict: true,
        };

        // Some implementations use method name `.decoder` and return an object; others may require calling model directly.
        // Try common variants.
        let decoderOutputs: any;
        if (typeof model.model.decoder === "function") {
            decoderOutputs = await model.model.decoder(decoderArgs);
        } else if (typeof model.model === "function") {
            // fallback: call model with decoder-style args
            decoderOutputs = await model.model(decoderArgs);
        } else {
            throw new Error("Transformer model does not expose a decoder method in this environment.");
        }


        // Prefer `last_hidden_state`, fall back to `hidden_states` or the first tensor in the output
        let lastHidden: any = decoderOutputs?.last_hidden_state ?? decoderOutputs?.hidden_states?.slice(-1)?.[0] ?? null;
        if (!lastHidden) {
            // If decoderOutputs itself looks like a tensor (e.g. Float32Array with dims property), use it
            if (decoderOutputs && decoderOutputs.data) {
                lastHidden = decoderOutputs;
            } else {
                throw new Error("Unable to find decoder last_hidden_state in outputs. Debug: " + JSON.stringify(Object.keys(decoderOutputs ?? {})));
            }
        }

        // lastHidden is expected to be an object with `.data` (Float32Array) and `.dims` (shape array)
        const data: Float32Array = lastHidden.data;
        const dims: number[] = lastHidden.dims;
        if (!data || !dims || dims.length !== 3) {
            throw new Error(`Decoder hidden state has unexpected shape or format. dims=${JSON.stringify(dims)}`);
        }

        const [batch, seqLen, hiddenDim] = dims;
        // Mean pool across sequence dimension
        const pooled = new Float32Array(batch * hiddenDim);
        for (let b = 0; b < batch; b++) {
            for (let h = 0; h < hiddenDim; h++) {
                let sum = 0.0;
                for (let t = 0; t < seqLen; t++) {
                    const idx = b * seqLen * hiddenDim + t * hiddenDim + h;
                    sum += data[idx];
                }
                pooled[b * hiddenDim + h] = sum / seqLen;
            }
        }

        // L2 normalize each batch vector
        for (let b = 0; b < batch; b++) {
            let norm = 0.0;
            for (let h = 0; h < hiddenDim; h++) {
                const v = pooled[b * hiddenDim + h];
                norm += v * v;
            }
            norm = Math.sqrt(norm);
            if (norm > 0) {
                for (let h = 0; h < hiddenDim; h++) {
                    pooled[b * hiddenDim + h] /= norm;
                }
            }
        }

        // Return plain JS array for ease of use in React
        const out: number[][] = [];
        for (let b = 0; b < batch; b++) {
            out.push(Array.from(pooled.slice(b * hiddenDim, (b + 1) * hiddenDim)));
        }


        return {
            pooled_hidden_states: out, // array of [batch, hidden_dim]
            raw_last_hidden_state: lastHidden,
        };
    };
    return model;
}