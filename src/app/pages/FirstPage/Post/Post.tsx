import React from 'react';
import BlockMath from "@matejmazur/react-katex";
import InlineMath from "@matejmazur/react-katex";
import 'katex/dist/katex.min.css';

const Post: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxHeight: '88vh', overflowY: 'auto', lineHeight: '1.6' }}>
      <h1 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Where the ⅓ Comes From in Cone Volume?</h1>

      <h2>Introduction</h2>
      <p>
        Most of us are taught that the formula for the volume of a cone is:
      </p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <BlockMath math="V = \frac{1}{3}\pi r^2 h" />
      </div>
      <p style={{ textAlign: 'center', fontStyle: 'italic', marginBottom: '20px' }}>
        where <InlineMath math="r" /> is the radius of the base and <InlineMath math="h" /> is the height of the cone
      </p>
      <p>
        While most education programs present the formula <InlineMath math="V = \frac{1}{3}\pi r^2 h" />,
        they rarely explain the mathematical reasoning behind the 1/3 factor. We can intuitively understand that:
      </p>

      <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
        <li><InlineMath math="\pi r^2" /> represents the base area</li>
        <li>The volume clearly scales with both height and base area</li>
      </ul>

      <p>
        But why exactly 1/3? Why couldn't it be 1/2 or 1/4? We know the cone's volume must be less than
        its circumscribed cylinder (<InlineMath math="V_{cylinder} = \pi r^2 h" />), but the precise
        derivation reveals why nature settled on this particular fraction. This post will explore the reason
        behind this one-third constant.
      </p>

      <h2>Background</h2>
      <p>
        A cone is a three-dimensional geometric shape that tapers smoothly from a flat base (usually circular)
        to a point called the apex or vertex. It's basically a pyramid with a circular base.
      </p>
      <h3>Interactive Controls</h3>
      <ul>
        <li><strong>Rotate</strong>: Right-click + drag to spin the cone.</li>
        <li><strong>Move</strong>: Left-click + drag to reposition.</li>
        <li><strong>Zoom</strong>: Scroll to adjust the view.</li>
      </ul>

      <h3>Adjustable Settings</h3>
      <ul>
        <li><strong>Rotation Speed</strong>: Controls the cone's spin rate.</li>
        <li><strong>Delta h (Δh)</strong>: Modifies the cone's cross-section (explained below).</li>
      </ul>

      <h3>2D Cross-Section View</h3>
      <p>
        The panel on the bottom-right shows the cone's <strong>two-dimensional cross-section</strong>. Adjusting Δh alters this shape—observe the changes as Δh approaches <strong>0 (dh)</strong>.
      </p>

      <h2>Where does the 1/3 come from?</h2>
      <p>From a calculus perspective:</p>
      <p>We calculate the volume of a cone by summing the volumes of infinitely thin discs.</p>
      <p><strong>What does "infinitely thin" mean?</strong></p>
      <p>For simplicity, imagine a disc with height Δh. If Δh is large, a slice of the cone looks like an isosceles trapezoid in 2D. However, as we reduce Δh, making it approach 0 (but never reaching 0), we call it "infinitely small" and denote it as dh.</p>
      <p>A disc with height dh is so thin it resembles a piece of paper. By summing the volumes of all such "paper-thin" discs, we obtain the total volume of the Cone!</p>

      <h3>Let's construct the Formula for the Volume of the Cone</h3>
      <p>So the approach is summing all the infinitely small discs</p>

      <p>Let the height be <InlineMath math="h" />, then for a disc at height <InlineMath math="x" /> (from 0 to <InlineMath math="h" />) that has infinitely small height <InlineMath math="dx" />.</p>

      <p>
        The radius of the cone at height <InlineMath math="x" /> would be:{" "}
        <InlineMath math="y = r - \frac{x}{h}" />    where <InlineMath math="r" /> is the
        base radius.
      </p>

      <p>This leads to the area of the disc being:
        <BlockMath math="A = \pi y^2 = \pi \left(r - \frac{x}{h}\right)^2" /></p>

      <p>The volume of an infinitely thin disc is the area times its height:
        <BlockMath math="dV = A \cdot dx = \pi \left(r - \frac{x}{h}\right)^2 dx" /></p>

      <p>Summing all discs from <InlineMath math="x = 0" /> to <InlineMath math="x = h" /> gives the total volume is:</p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <BlockMath math="V = \int_0^h dV = \int_0^h \pi \left(r - \frac{x}{h}\right)^2 dx" />
      </div>

      <p>Solving this integral:</p>
      <p>If want we can do a button here and when click appear how to solve the intergral</p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <BlockMath math="V = \frac{1}{3}\pi r^2 h" />
      </div>

      <p>Thus, we arrive at the familiar formula for the volume of a cone:
        <BlockMath math="V = \frac{1}{3}\pi r^2 h" /></p>

    </div>
  );
};

export default Post;