import React, { useEffect, useState } from "react";
import styles from "./WhisperTransformersPrototype.module.css";
import { AutoModelForSpeechSeq2Seq, AutoProcessor } from "@xenova/transformers";
import { patchTransformers } from "./patchTransformers";


const MODEL_ID = "openai/whisper-large-v3-turbo";

export default function WhisperTransformersPrototype(): React.JSX.Element {
    const [model, setModel] = useState<any | null>(null);
    const [processor, setProcessor] = useState<any | null>(null);
    const [status, setStatus] = useState("idle");
    const [encoderJson, setEncoderJson] = useState<string>("");
    const [decoderIdsJson, setDecoderIdsJson] = useState<string>("");
    const [embedding, setEmbedding] = useState<number[] | null>(null);

    useEffect(() => {
        (async () => {
            setStatus("Loading processor and model (this may take a few seconds)...");
            try {
                const proc = await AutoProcessor.from_pretrained(MODEL_ID);
                const mdl = await AutoModelForSpeechSeq2Seq.from_pretrained(MODEL_ID);
                // Patch the model instance to add getDecoderEmbedding
                await patchTransformers(mdl);
                setProcessor(proc);
                setModel(mdl);
                setStatus("Model & processor loaded. Paste encoder_hidden_states + decoder_input_ids to test.");
            } catch (err) {
                console.error(err);
                setStatus("Failed to load model/processor: " + String(err));
            }
        })();
    }, []);

    const run = async () => {
        if (!model) {
            setStatus("Model not loaded yet.");
            return;
        }


        let encoder: any;
        let decoderIds: any;
        try {
            encoder = JSON.parse(encoderJson);
            decoderIds = JSON.parse(decoderIdsJson);
        } catch (err) {
            setStatus("Invalid JSON inputs.");
            return;
        }


        setStatus("Running decoder (via transformers.js patched method)...");
        try {
            const out = await model.getDecoderEmbedding({ encoder_hidden_states: encoder, decoder_input_ids: decoderIds });
            setEmbedding(out.pooled_hidden_states[0]);
            setStatus("Done — embedding computed.");
        } catch (err) {
            console.error(err);
            setStatus("Runtime error: " + String(err));
        }
    };

    return (
        <div className={styles.container}>
            <h2>Whisper transformers.js patch prototype</h2>
            <p>Model: {MODEL_ID}</p>
            <div className={styles.status}>Status: {status}</div>


            <label className={styles.label}>Paste encoder_hidden_states JSON (shape [1, seq_len, hidden_dim]):</label>
            <textarea className={styles.textarea} value={encoderJson} onChange={(e) => setEncoderJson(e.target.value)} />


            <label className={styles.label}>Paste decoder_input_ids JSON (shape [1, dec_seq_len]):</label>
            <textarea className={styles.textarea} value={decoderIdsJson} onChange={(e) => setDecoderIdsJson(e.target.value)} />


            <div className={styles.row}>
                <button className={styles.button} onClick={run}>Run decoder and get embedding</button>
            </div>


            {embedding && (
                <div className={styles.resultBox}>
                    <h3>Embedding (first 64 dims)</h3>
                    <pre className={styles.embeddingPre}>{JSON.stringify(embedding.slice(0, 64), null, 2)}</pre>
                </div>
            )}


            <div className={styles.footer}>
                Notes: This prototype patches a loaded transformers.js model instance to expose the decoder path
                and compute mean-pooled decoder embeddings. For a full end-to-end browser flow you'd:
                <ol>
                    <li>Export or replicate the audio preprocessing in JS (mel spectrogram),</li>
                    <li>Use the processor/feature_extractor to produce encoder inputs,</li>
                    <li>Call the model.encoder and model.decoder like above,</li>
                    <li>Keep an eye on model size: use a small whisper for browser testing.</li>
                </ol>
            </div>
        </div>
    );
}