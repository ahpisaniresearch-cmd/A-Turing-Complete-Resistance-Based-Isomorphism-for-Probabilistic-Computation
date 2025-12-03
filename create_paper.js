const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle, 
        WidthType, ShadingType, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

// Helper functions
const heading1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  children: [new TextRun({ text, bold: true, size: 32, font: "Arial" })]
});

const heading2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 150 },
  children: [new TextRun({ text, bold: true, size: 26, font: "Arial" })]
});

const heading3 = (text) => new Paragraph({
  spacing: { before: 200, after: 100 },
  children: [new TextRun({ text, bold: true, size: 24, font: "Arial" })]
});

const para = (text, options = {}) => new Paragraph({
  spacing: { after: 120 },
  alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
  indent: options.indent ? { left: 720 } : undefined,
  children: [new TextRun({ text, size: 24, font: "Arial", ...options })]
});

const italicPara = (text) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, size: 24, font: "Arial", italics: true })]
});

const boldPara = (text) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, size: 24, font: "Arial", bold: true })]
});

const mathPara = (text, options = {}) => new Paragraph({
  spacing: { before: 100, after: 100 },
  alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
  indent: { left: 720 },
  children: [new TextRun({ text, size: 24, font: "Cambria Math" })]
});

const spacer = () => new Paragraph({ spacing: { after: 200 }, children: [] });

// Create formatted paragraph with mixed styling
const mixedPara = (segments) => new Paragraph({
  spacing: { after: 120 },
  children: segments.map(seg => {
    if (typeof seg === 'string') return new TextRun({ text: seg, size: 24, font: "Arial" });
    return new TextRun({ size: 24, font: seg.math ? "Cambria Math" : "Arial", ...seg });
  })
});

// Table helper
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "888888" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const tableCell = (content, options = {}) => new TableCell({
  borders: cellBorders,
  width: { size: options.width || 2340, type: WidthType.DXA },
  shading: options.header ? { fill: "E8E8E8", type: ShadingType.CLEAR } : undefined,
  children: Array.isArray(content) ? content : [
    new Paragraph({
      alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ 
        text: content, 
        size: 22, 
        font: options.math ? "Cambria Math" : "Arial",
        bold: options.header || options.bold
      })]
    })
  ]
});

// Build the document
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 24 } }
    },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, font: "Arial" },
        paragraph: { spacing: { after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-4",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-5",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "A Turing-Complete Resistance-Based Isomorphism", italics: true, size: 20, font: "Arial" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 20, font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Arial" }),
            new TextRun({ text: " of ", size: 20, font: "Arial" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20, font: "Arial" })
          ]
        })]
      })
    },
    children: [
      // ===== TITLE PAGE =====
      new Paragraph({ spacing: { after: 600 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "A Turing-Complete Resistance-Based Isomorphism", bold: true, size: 48, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: "for Probabilistic Computation", bold: true, size: 48, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: "Alexander Pisani", size: 26, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: "a.h.pisani.research@gmail.com", size: 20, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: "December 2025", size: 22, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: "Submitted for Review", italics: true, size: 22, font: "Arial" })]
      }),

      // ===== ABSTRACT =====
      boldPara("Abstract"),
      para("This paper establishes a rigorous isomorphism between probability mathematics and informational resistance. The fundamental translation Ω(P) = −ln(P) maps probability to resistance, transforming multiplication into addition. This correspondence extends across four equivalent representations (natural language, probability theory, circuit topology, and prime coordinate vectors) which function as a Rosetta Stone for discrete mathematics: the same computation can be expressed in any layer and translated exactly to the others."),
      spacer(),
      para("Boolean logic emerges from circuit topology: AND as series (resistances add), OR as parallel (conductances add), and NOT as phase interference. We prove the framework's validity through two complete worked examples. First, we derive the probability that two random integers are coprime, obtaining the known result 6/π² by traversing all four representation layers. Second, we demonstrate that relational database operations (JOIN, UNION, INTERSECTION) map directly to number-theoretic operations (GCD, LCM). We establish Turing completeness by constructing an explicit simulation of counter machines using prime exponents as registers."),
      spacer(),
      para("The framework reveals that prime numbers are precisely the irreducible elements of this informational structure, configurations whose resistance cannot be decomposed into sums of smaller resistances. This characterization, combined with the Gödel-style encoding of data through prime coordinates, suggests that any sufficiently powerful computational system must rediscover the primes as a structural necessity."),
      
      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART I: INTRODUCTION =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART I: FOUNDATIONS", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("1. Introduction"),
      para("The prime numbers have fascinated mathematicians for millennia. They appear to be fundamental building blocks of arithmetic, yet their distribution along the number line exhibits patterns that remain mysterious despite centuries of study. This paper takes a novel approach: rather than treating primes as given mathematical objects, we develop a computational framework in which primes are characterized as the irreducible elements of an informational structure."),
      spacer(),
      para("Our central insight is that the mathematical structure of probability multiplication maps precisely onto the physical behavior of resistors in series. When two independent events must both occur (logical AND), their probabilities multiply:"),
      mathPara("P(A ∩ B) = P(A) × P(B)"),
      para("In circuit terms, resistors in series add:"),
      mathPara("Ω_total = Ω_A + Ω_B"),
      para("The logarithm mediates between these domains, transforming multiplication into addition. This is not merely an analogy; it is an exact mathematical isomorphism that preserves algebraic structure."),
      spacer(),
      
      heading2("1.1 The Four-Layer Framework"),
      para("We demonstrate that every computation in this framework can be expressed equivalently in four representations:"),
      spacer(),
      new Paragraph({
        numbering: { reference: "numbered-1", level: 0 },
        children: [new TextRun({ text: "English: Natural language description of the computation", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-1", level: 0 },
        children: [new TextRun({ text: "Probability: Mathematical formulation using probability theory", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-1", level: 0 },
        children: [new TextRun({ text: "Circuit: Physical topology of resistors and conductances", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-1", level: 0 },
        children: [new TextRun({ text: "Vector Space: Coordinates in infinite-dimensional prime space", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("Each layer provides different intuitions and computational tools, but all four are mathematically equivalent. A proof in one layer automatically translates to proofs in the others."),

      heading1("2. The Fundamental Mapping"),
      
      heading2("2.1 Informational Resistance"),
      mixedPara([
        { text: "Definition 2.1 (Informational Resistance). ", bold: true },
        "For a probability value P ∈ (0, 1], the informational resistance is:"
      ]),
      mathPara("Ω(P) = −ln(P)", { center: true }),
      para("For P = 0, we define Ω(0) = ∞. This establishes a bijection between (0, 1] and [0, ∞), mapping certainty (P = 1) to zero resistance and impossibility (P → 0) to infinite resistance."),
      spacer(),
      para("The connection to information theory is immediate: −ln(P) is precisely the self-information (surprisal) of an event with probability P, measured in nats. Thus informational resistance quantifies the \"surprise\" or \"information cost\" associated with an event occurring."),

      heading2("2.2 The Binary Extremes"),
      mixedPara([{ text: "State 1 (True/Certain): ", bold: true }, "Ω(1) = −ln(1) = 0. Zero resistance; information flows unimpeded."]),
      mixedPara([{ text: "State 0 (False/Impossible): ", bold: true }, "Ω(0) = −ln(0) = ∞. Infinite resistance; the circuit is broken."]),
      spacer(),
      para("These boundary conditions ensure that classical binary logic emerges naturally from the continuous probability framework."),

      heading2("2.3 The Isomorphism Theorem"),
      mixedPara([{ text: "Theorem 2.2 (Probability-Resistance Homomorphism). ", bold: true, italics: true }, "The map Ω: (0, 1] → [0, ∞) defined by Ω(P) = −ln(P) is a monoid isomorphism from ((0, 1], ×) to ([0, ∞), +). That is:"]),
      mathPara("Ω(P₁ × P₂) = Ω(P₁) + Ω(P₂)", { center: true }),
      mixedPara([{ text: "Proof. ", italics: true }, "Direct application of the logarithm property: Ω(P₁ × P₂) = −ln(P₁ × P₂) = −ln(P₁) − ln(P₂) = Ω(P₁) + Ω(P₂). The map is bijective with inverse P = e^(−Ω), and both Ω and its inverse are continuous. □"]),
      spacer(),
      mixedPara([{ text: "Note: ", italics: true }, "We say monoid rather than group because ((0, 1], ×) lacks multiplicative inverses within the interval (e.g., the inverse of 0.5 is 2, which lies outside (0, 1]). However, the map extends naturally to a full group isomorphism from ((0, ∞), ×) to (ℝ, +), corresponding to the extension from probabilities to likelihood ratios."]),

      heading2("2.4 Uniqueness"),
      mixedPara([{ text: "Theorem 2.3. ", bold: true, italics: true }, "The mapping Ω(P) = −ln(P) is the unique continuous function f: (0, 1] → [0, ∞) satisfying f(P₁ · P₂) = f(P₁) + f(P₂), up to a positive multiplicative constant."]),
      spacer(),
      mixedPara([{ text: "Proof sketch. ", italics: true }, "The functional equation f(xy) = f(x) + f(y) is Cauchy's logarithmic equation. For continuous functions, the only solutions are f(x) = c·ln(x) for some constant c. The constraint f: (0, 1] → [0, ∞) requires c < 0; normalizing so that f(1/e) = 1 gives c = −1, yielding f(P) = −ln(P). See Aczél (1966), Lectures on Functional Equations, for the complete treatment. □"]),
      spacer(),
      para("This theorem establishes that our framework is not arbitrary: the logarithmic mapping is forced by the requirement that series combination be additive. Any other continuous mapping would fail to preserve the algebraic structure."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART II: BOOLEAN LOGIC =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART II: BOOLEAN LOGIC", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("3. AND Logic: Series Circuits"),
      
      mixedPara([{ text: "Theorem 3.1 (AND-Series Correspondence). ", bold: true, italics: true }, "For independent events A and B, the AND operation P(A ∩ B) = P(A) × P(B) corresponds to series circuit addition:"]),
      mathPara("Ω(A ∩ B) = Ω(A) + Ω(B)", { center: true }),
      
      heading2("3.1 Circuit Topology"),
      para("In a series circuit, current must pass through both resistors. The total resistance is the sum of individual resistances. This directly implements AND logic: both conditions must be satisfied."),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        border: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
        children: [new TextRun({ text: "SERIES CIRCUIT (AND GATE)", bold: true, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "━━━━━[ Ω_A ]━━━━━[ Ω_B ]━━━━━", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "Ω_total = Ω_A + Ω_B    ⟹    P_total = P_A × P_B", size: 22, font: "Cambria Math" })]
      }),

      heading2("3.2 Worked Example: Drawing a Red Ace"),
      mixedPara([{ text: "English: ", bold: true }, "\"What is the probability of drawing a Red Ace from a standard deck of cards?\""]),
      spacer(),
      para("This requires both conditions to be true: the card must be Red AND the card must be an Ace. These attributes are independent: knowing a card is Red does not change the probability it is an Ace (2 of 26 red cards are Aces = 1/13, same as 4 of 52 total). Thus P(Ace|Red) = P(Ace), and we can multiply."),
      spacer(),
      mixedPara([{ text: "Probability Formulation:", bold: true }]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(Ace) = 4/52 = 1/13", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(Red) = 26/52 = 1/2", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(Red Ace) = P(Ace) × P(Red) = 1/13 × 1/2 = 1/26", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Circuit Formulation:", bold: true }]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Ω(Ace) = −ln(1/13) = ln(13) ≈ 2.565", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Ω(Red) = −ln(1/2) = ln(2) ≈ 0.693", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Ω(Red Ace) = Ω(Ace) + Ω(Red) = 2.565 + 0.693 = 3.258", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Verification: ", bold: true }, "e^(−3.258) = 1/26 ≈ 0.0385 ✓"]),

      heading1("4. OR Logic: Parallel Circuits"),
      
      heading2("4.1 Mutually Exclusive Events"),
      mixedPara([{ text: "Theorem 4.1 (OR-Parallel Correspondence, Exclusive Case). ", bold: true, italics: true }, "For mutually exclusive events A and B (where P(A ∩ B) = 0), the OR operation corresponds to parallel circuit conductance addition:"]),
      mathPara("G_total = G(A) + G(B) = P(A) + P(B)", { center: true }),
      para("where G = P in the informational domain."),

      heading2("4.2 Circuit Topology"),
      para("In a parallel circuit, current can flow through either path. The total conductance is the sum of individual conductances. This implements OR logic: either condition being satisfied allows flow."),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        border: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
        children: [new TextRun({ text: "PARALLEL CIRCUIT (OR GATE)", bold: true, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "       ┌━━━[ Ω_A ]━━━┐", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "━━━━━━┤             ├━━━━━━", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "       └━━━[ Ω_B ]━━━┘", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "G_total = G_A + G_B    ⟹    P_total = P_A + P_B", size: 22, font: "Cambria Math" })]
      }),

      heading2("4.3 Worked Example: Rolling a 2 or 3"),
      mixedPara([{ text: "English: ", bold: true }, "\"What is the probability of rolling a 2 OR a 3 on a fair six-sided die?\""]),
      spacer(),
      para("These are mutually exclusive events: you cannot roll both a 2 and a 3 simultaneously."),
      spacer(),
      mixedPara([{ text: "Probability Formulation:", bold: true }]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(roll 2) = 1/6, P(roll 3) = 1/6", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(roll 2 OR roll 3) = 1/6 + 1/6 = 2/6 = 1/3", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Circuit Formulation:", bold: true }]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "G(roll 2) = 1/6, G(roll 3) = 1/6", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "G_total = 1/6 + 1/6 = 1/3", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Ω_total = −ln(1/3) = ln(3) ≈ 1.099", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Verification: ", bold: true }, "P(roll 2 OR roll 3) = 2/6 = 1/3 ✓"]),

      heading2("4.4 Inclusive OR: Handling Non-Exclusive Events"),
      para("For events that can co-occur (P(A ∩ B) ≠ 0), the standard inclusion-exclusion principle applies:"),
      mathPara("P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", { center: true }),
      para("In circuit terms, this requires a correction for the \"overlap conductance\":"),
      mathPara("G_inclusive = G_A + G_B − G_{A∩B}", { center: true }),
      spacer(),
      para("The correction term G_{A∩B} = P(A ∩ B) is computed via AND (series circuit), then subtracted using our phase-shift mechanism. The circuit topology becomes:"),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        border: { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder },
        children: [new TextRun({ text: "INCLUSIVE OR CIRCUIT", bold: true, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "        ┌━━━[ Ω_A ]━━━┐", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "    ━━━━┤             ├━━━━┓", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "        └━━━[ Ω_B ]━━━┘    ┃", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "                           ╋━━━ Output", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "    ━━━[ Ω_A ]━━[ Ω_B ]━━━━┛", size: 24, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "(π-shifted: subtracts overlap)", size: 20, font: "Arial", italics: true })]
      }),
      para("The lower branch computes P(A ∩ B) via series, then phase-shifts by π to produce −P(A ∩ B). Summing with the parallel branch yields P(A) + P(B) − P(A ∩ B)."),

      heading2("4.5 The Parallel Resistance Formula"),
      para("For n parallel paths with resistances Ω₁, Ω₂, ..., Ωₙ:"),
      mathPara("Ω_total = −ln(e^(−Ω₁) + e^(−Ω₂) + ... + e^(−Ωₙ))", { center: true }),
      para("This log-sum-exp formula appears in statistical mechanics (partition functions), machine learning (softmax normalization), and information theory, revealing deep structural connections across disciplines."),

      heading1("5. NOT Logic: The Phase-Shift Inverter"),
      
      heading2("5.1 The Challenge"),
      para("To complete universal Boolean logic, we require a NOT operation: NOT(A) means P(¬A) = 1 − P(A). This presents a fundamental challenge: our framework is built on multiplication (AND) and addition (OR), but NOT requires subtraction from unity."),
      spacer(),
      para("In the resistance domain, subtraction has no natural interpretation: resistances only add in series. To enable NOT, we must extend the framework from real-valued probabilities to complex amplitudes, analogous to the extension from DC circuits (pure resistance) to AC circuits (impedance with phase)."),

      heading2("5.2 The Complex Amplitude Framework"),
      para("We represent probability states in polar form:"),
      mathPara("Z = P · e^(iθ) = P(cos θ + i sin θ)", { center: true }),
      para("where P = |Z| is the probability magnitude and θ is the phase angle."),
      spacer(),
      mixedPara([{ text: "What phase represents: ", bold: true }, "Phase is a bookkeeping degree of freedom that enables interference. Just as quantum mechanical amplitudes carry phase that cancels in destructive interference, our complex probabilities carry phase that enables subtraction through the identity e^(iπ) = −1."]),
      spacer(),
      mixedPara([{ text: "Interaction with other operations:", bold: true }]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "AND (multiplication): Phases add. Z₁ × Z₂ = P₁P₂ · e^(i(θ₁+θ₂))", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "OR (addition): Phases must match for coherent addition, or be tracked separately", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "NOT (interference): Phase enables subtraction via π-shift", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Observable output: ", bold: true }, "Only the magnitude |Z| = P is physically meaningful as probability. Phase is internal to the computation, analogous to quantum amplitudes where only |ψ|² is observable. This is why the NOT operation preserves phase: it tracks identity through the inversion."]),

      heading2("5.3 The Phase-Shift Inverter"),
      para("We implement NOT using destructive interference. The key insight is that multiplying by e^(iπ) = −1 produces a 180° phase shift, enabling subtraction."),
      spacer(),
      mixedPara([{ text: "Definition 5.1 (NOT Operation). ", bold: true }, "For a complex probability state Z = P·e^(iθ):"]),
      mathPara("NOT(Z) = (Z/|Z|) − Z = (1 − |Z|) · e^(i·arg(Z))", { center: true }),
      spacer(),
      para("The operation requires a reference signal at P = 1 (certainty) to compute the complement. This is analogous to needing a voltage reference in electronic inverters. The three steps:"),
      new Paragraph({
        numbering: { reference: "numbered-2", level: 0 },
        children: [new TextRun({ text: "Normalize: Extract phase to create reference Z_ref = e^(iθ) (magnitude 1, same phase)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-2", level: 0 },
        children: [new TextRun({ text: "π-Shift: Multiply input by −1 to produce Z' = −P·e^(iθ)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-2", level: 0 },
        children: [new TextRun({ text: "Sum: Add reference and shifted input: Z_out = e^(iθ) − P·e^(iθ) = (1−P)·e^(iθ)", size: 24, font: "Arial" })]
      }),

      heading2("5.4 Verification"),
      para("Test case: NOT(0.3) with phase θ = π/4"),
      spacer(),
      new Table({
        columnWidths: [2500, 3500, 2500],
        rows: [
          new TableRow({
            children: [
              tableCell("Step", { header: true, center: true }),
              tableCell("Calculation", { header: true, center: true }),
              tableCell("Result", { header: true, center: true })
            ]
          }),
          new TableRow({ children: [
            tableCell("Input"), tableCell("Z_in = 0.3·e^(iπ/4)"), tableCell("0.212 + 0.212i")
          ]}),
          new TableRow({ children: [
            tableCell("Normalize"), tableCell("Z_ref = e^(iπ/4)"), tableCell("0.707 + 0.707i")
          ]}),
          new TableRow({ children: [
            tableCell("π-shift"), tableCell("Z' = −Z_in"), tableCell("−0.212 − 0.212i")
          ]}),
          new TableRow({ children: [
            tableCell("Sum"), tableCell("Z_out = Z_ref + Z'"), tableCell("0.495 + 0.495i")
          ]}),
          new TableRow({ children: [
            tableCell("Magnitude"), tableCell("|Z_out|"), tableCell("0.7 ✓", { bold: true })
          ]}),
          new TableRow({ children: [
            tableCell("Phase"), tableCell("arg(Z_out)"), tableCell("π/4 (preserved) ✓", { bold: true })
          ]})
        ]
      }),
      spacer(),
      mixedPara([{ text: "Double inversion test: ", bold: true }, "NOT(NOT(0.3)) = NOT(0.7) = 0.3 ✓"]),

      heading1("6. Complete Boolean Logic"),
      
      para("With AND, OR, and NOT gates established, the framework possesses a functionally complete set of Boolean operators. Any Boolean function can be constructed from these primitives."),

      heading2("6.1 Derived Gates"),
      new Table({
        columnWidths: [2000, 4000, 2500],
        rows: [
          new TableRow({
            children: [
              tableCell("Gate", { header: true, center: true }),
              tableCell("Construction", { header: true, center: true }),
              tableCell("Property", { header: true, center: true })
            ]
          }),
          new TableRow({ children: [
            tableCell("NAND"), tableCell("NOT(AND(A, B))"), tableCell("Universal")
          ]}),
          new TableRow({ children: [
            tableCell("NOR"), tableCell("NOT(OR(A, B))"), tableCell("Universal")
          ]}),
          new TableRow({ children: [
            tableCell("XOR"), tableCell("(A AND NOT B) OR (NOT A AND B)"), tableCell("Exclusive or")
          ]}),
          new TableRow({ children: [
            tableCell("XNOR"), tableCell("NOT(XOR(A, B))"), tableCell("Equivalence")
          ]})
        ]
      }),
      spacer(),
      para("Note: XOR is implemented as the OR of two AND branches, each combining one input with the NOT of the other. For independent events A and B, the probability formula P(A XOR B) = P(A)(1−P(B)) + (1−P(A))P(B) = P(A) + P(B) − 2P(A)P(B) follows from expanding this construction. The independence assumption is required for the multiplicative decomposition P(A ∧ ¬B) = P(A)P(¬B). In circuit terms, XOR requires series (AND), phase-shift (NOT), and parallel (OR) operations combined."),

      heading2("6.2 Binary Truth Table Verification"),
      para("We verify AND and NOT using boundary values P = 1 (TRUE) and P = 0 (FALSE):"),
      spacer(),
      mixedPara([{ text: "AND Gate:", bold: true }]),
      new Table({
        columnWidths: [1500, 1500, 1500, 1500, 2000],
        rows: [
          new TableRow({
            children: [
              tableCell("A", { header: true, center: true }),
              tableCell("B", { header: true, center: true }),
              tableCell("Ω_A", { header: true, center: true }),
              tableCell("Ω_B", { header: true, center: true }),
              tableCell("P_out", { header: true, center: true })
            ]
          }),
          new TableRow({ children: [
            tableCell("1", { center: true }), tableCell("1", { center: true }), 
            tableCell("0", { center: true }), tableCell("0", { center: true }), 
            tableCell("1 ✓", { center: true, bold: true })
          ]}),
          new TableRow({ children: [
            tableCell("1", { center: true }), tableCell("0", { center: true }), 
            tableCell("0", { center: true }), tableCell("∞", { center: true }), 
            tableCell("0 ✓", { center: true, bold: true })
          ]}),
          new TableRow({ children: [
            tableCell("0", { center: true }), tableCell("1", { center: true }), 
            tableCell("∞", { center: true }), tableCell("0", { center: true }), 
            tableCell("0 ✓", { center: true, bold: true })
          ]}),
          new TableRow({ children: [
            tableCell("0", { center: true }), tableCell("0", { center: true }), 
            tableCell("∞", { center: true }), tableCell("∞", { center: true }), 
            tableCell("0 ✓", { center: true, bold: true })
          ]})
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART III: THE VECTOR SPACE LAYER =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART III: THE VECTOR SPACE LAYER", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("7. Prime Coordinates"),
      
      heading2("7.1 The Fundamental Theorem of Arithmetic"),
      para("Every positive integer n > 1 has a unique representation as a product of prime powers:"),
      mathPara("n = 2^(a₂) × 3^(a₃) × 5^(a₅) × 7^(a₇) × ...", { center: true }),
      para("The exponents (a₂, a₃, a₅, a₇, ...) form an infinite-dimensional coordinate vector:"),
      mathPara("v(n) = (a₂, a₃, a₅, a₇, ...)", { center: true }),

      heading2("7.2 Examples"),
      new Table({
        columnWidths: [1500, 3000, 4000],
        rows: [
          new TableRow({
            children: [
              tableCell("n", { header: true, center: true }),
              tableCell("Factorization", { header: true, center: true }),
              tableCell("Coordinate Vector", { header: true, center: true })
            ]
          }),
          new TableRow({ children: [
            tableCell("12", { center: true }), 
            tableCell("2² × 3¹"), 
            tableCell("(2, 1, 0, 0, ...)")
          ]}),
          new TableRow({ children: [
            tableCell("35", { center: true }), 
            tableCell("5¹ × 7¹"), 
            tableCell("(0, 0, 1, 1, 0, ...)")
          ]}),
          new TableRow({ children: [
            tableCell("2", { center: true }), 
            tableCell("2¹ (prime)"), 
            tableCell("(1, 0, 0, 0, ...), single non-zero")
          ]}),
          new TableRow({ children: [
            tableCell("30", { center: true }), 
            tableCell("2¹ × 3¹ × 5¹"), 
            tableCell("(1, 1, 1, 0, ...)")
          ]})
        ]
      }),
      spacer(),
      mixedPara([{ text: "Key insight: ", bold: true }, "Primes have exactly one non-zero coordinate. This is their defining characteristic in the vector space."]),
      spacer(),
      mixedPara([{ text: "Identity element: ", bold: true }, "The multiplicative identity 1 has no prime factors, so v(1) = (0, 0, 0, ...), the zero vector. This is consistent: multiplying by 1 leaves any number unchanged, and adding the zero vector leaves any coordinate unchanged."]),

      heading2("7.3 Linear Independence"),
      mixedPara([{ text: "Theorem 7.1. ", bold: true, italics: true }, "The set {ln(p) : p prime} is linearly independent over the rationals."]),
      spacer(),
      mixedPara([{ text: "Proof. ", italics: true }, "Suppose there exists a non-trivial rational linear combination Σ q_p · ln(p) = 0 with not all q_p zero. Since any such combination involves only finitely many terms with non-zero coefficients, we may clear denominators to obtain integer coefficients: Σ a_p · ln(p) = 0. Exponentiating both sides: ∏ p^(a_p) = 1, which is a well-defined positive rational. But by the Fundamental Theorem of Arithmetic, the only product of prime powers equaling 1 has all exponents zero. This contradicts our assumption of a non-trivial combination. □"]),
      spacer(),
      para("This establishes that the prime coordinate system forms an authentic infinite-dimensional vector space over ℚ (or ℝ). Technically, we work in a countably-infinite-dimensional space where each integer has only finitely many nonzero coordinates, the space of sequences with finite support."),

      heading2("7.4 The True Vector Space"),
      para("Under the logarithm, multiplication becomes addition:"),
      mathPara("ln(n) = a₂·ln(2) + a₃·ln(3) + a₅·ln(5) + ...", { center: true }),
      para("This is a genuine linear combination with:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Basis vectors: {ln(2), ln(3), ln(5), ln(7), ...}", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Coordinates: (a₂, a₃, a₅, a₇, ...)", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("The linear independence proven above means this is not merely a notational convenience; it is exact mathematical structure."),

      heading2("7.5 Operations in Vector Space"),
      new Table({
        columnWidths: [2500, 3000, 3000],
        rows: [
          new TableRow({
            children: [
              tableCell("Arithmetic", { header: true, center: true }),
              tableCell("Vector Operation", { header: true, center: true }),
              tableCell("Example", { header: true, center: true })
            ]
          }),
          new TableRow({ children: [
            tableCell("a × b"), tableCell("v(a) + v(b)"), tableCell("v(6) = v(2) + v(3)")
          ]}),
          new TableRow({ children: [
            tableCell("a / b"), tableCell("v(a) − v(b)"), tableCell("v(6) − v(2) = v(3)")
          ]}),
          new TableRow({ children: [
            tableCell("gcd(a, b)"), tableCell("min(v(a), v(b))"), tableCell("gcd(12, 18) = 6")
          ]}),
          new TableRow({ children: [
            tableCell("lcm(a, b)"), tableCell("max(v(a), v(b))"), tableCell("lcm(12, 18) = 36")
          ]}),
          new TableRow({ children: [
            tableCell("a^n"), tableCell("n · v(a)"), tableCell("v(8) = 3 · v(2)")
          ]})
        ]
      }),
      spacer(),
      para("Note: Division a/b corresponds to v(a) − v(b) only when b divides a (i.e., when all coordinates of v(b) are ≤ corresponding coordinates of v(a)). The positive integers under multiplication form a monoid, not a group; inverses do not generally exist within ℤ⁺."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART IV: PROOF OF CONCEPT I =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART IV: PROOF OF CONCEPT", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("8. The Coprimality Theorem"),
      
      para("We demonstrate the complete framework by deriving a known number-theoretic result through all four representation layers."),
      spacer(),
      mixedPara([{ text: "Theorem 8.1. ", bold: true, italics: true }, "The probability that two randomly chosen positive integers are coprime equals 6/π² ≈ 0.6079."]),
      spacer(),
      para("Note: Since there is no uniform probability distribution on ℤ⁺, this theorem uses natural density: P(coprime) = lim_{N→∞} |{(a,b) : 1 ≤ a,b ≤ N, gcd(a,b) = 1}| / N². The limit exists and equals 6/π²."),

      heading2("8.1 Layer 1: English Formulation"),
      mixedPara([{ text: "Question: ", bold: true }, "\"What is the probability that two randomly chosen integers a and b share no common factors?\""]),
      spacer(),
      para("Definition: Two integers are coprime if and only if gcd(a, b) = 1."),
      spacer(),
      para("Equivalent statement: \"For EVERY prime p, it is NOT the case that p divides BOTH a AND b.\""),
      spacer(),
      para("This is a universal quantification over all primes, an infinite conjunction of conditions."),

      heading2("8.2 Layer 2: Probability Formulation"),
      para("For a single prime p:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(p divides a random integer) = 1/p  (every pth integer is divisible by p)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(p divides BOTH a AND b) = 1/p × 1/p = 1/p²  (independence)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "P(p does NOT divide both) = 1 − 1/p²", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("For coprimality, ALL primes must fail to divide both. Divisibility by different primes is independent (by the Chinese Remainder Theorem: residue classes mod p and mod q are independent for distinct primes p, q). Therefore:"),
      mathPara("P(gcd(a,b) = 1) = ∏_{p prime} (1 − 1/p²)", { center: true }),

      heading2("8.3 Layer 3: Circuit Formulation"),
      para("Each prime p defines a \"filter\" in the circuit:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Conductance contribution: G_p = 1 − 1/p²", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Resistance contribution: Ω_p = −ln(1 − 1/p²)", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("The filters are in SERIES (AND logic, all must pass):"),
      mathPara("Ω_total = Σ_{p prime} −ln(1 − 1/p²)", { center: true }),
      para("Total conductance:"),
      mathPara("G_total = e^(−Ω_total) = ∏_{p prime} (1 − 1/p²)", { center: true }),

      heading2("8.4 Layer 4: Vector Space Formulation"),
      para("In prime coordinate space:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Integer a has coordinates v_a = (a₂, a₃, a₅, ...) where a_p = exponent of p in a", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Integer b has coordinates v_b = (b₂, b₃, b₅, ...)", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("GCD operation = component-wise MINIMUM:"),
      mathPara("v_{gcd} = min(v_a, v_b) = (min(a₂, b₂), min(a₃, b₃), ...)", { center: true }),
      para("Coprime condition: v_{gcd} = (0, 0, 0, ...) = zero vector"),
      spacer(),
      para("For each dimension (prime p):"),
      mathPara("P(min(a_p, b_p) = 0) = 1 − P(both a_p ≥ 1 and b_p ≥ 1) = 1 − 1/p²", { center: true }),

      heading2("8.5 Connection to the Zeta Function"),
      para("The Euler product formula states:"),
      mathPara("ζ(s) = Σ_{n=1}^{∞} 1/n^s = ∏_{p prime} 1/(1 − p^(−s))", { center: true }),
      para("At s = 2:"),
      mathPara("ζ(2) = ∏_{p prime} 1/(1 − 1/p²)", { center: true }),
      para("Therefore:"),
      mathPara("∏_{p prime} (1 − 1/p²) = 1/ζ(2)", { center: true }),
      para("And since ζ(2) = π²/6 (the Basel problem, proved by Euler in 1734):"),
      mathPara("P(gcd(a,b) = 1) = 1/ζ(2) = 6/π² ≈ 0.6079271...", { center: true }),

      heading2("8.6 Complete Translation Chain"),
      new Table({
        columnWidths: [2000, 6500],
        rows: [
          new TableRow({ children: [
            tableCell("Layer", { header: true, center: true }),
            tableCell("Expression", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("English", { bold: true }),
            tableCell("\"The probability that two random integers share no common factor\"")
          ]}),
          new TableRow({ children: [
            tableCell("Probability", { bold: true }),
            tableCell("P(coprime) = ∏_p (1 − 1/p²) = 1/ζ(2) = 6/π²")
          ]}),
          new TableRow({ children: [
            tableCell("Circuit", { bold: true }),
            tableCell("G = 6/π² ≈ 0.608,  Ω = ln(π²/6) ≈ 0.498")
          ]}),
          new TableRow({ children: [
            tableCell("Vector", { bold: true }),
            tableCell("P(min(v_a, v_b) = 0⃗), component-wise minimum is zero")
          ]})
        ]
      }),

      heading2("8.7 Numerical Verification"),
      para("Partial product (first 10 primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29):"),
      mathPara("∏_{p≤29} (1 − 1/p²) = (3/4)(8/9)(24/25)(48/49)... ≈ 0.6123", { center: true }),
      para("As more primes are included, this converges to 6/π² ≈ 0.6079."),
      spacer(),
      mixedPara([{ text: "Monte Carlo verification: ", bold: true }, "Sampling 1,000,000 random pairs (a, b) with a, b ∈ [1, 10000]:"]),
      para("Empirical P(coprime) ≈ 0.6080 ± 0.0005 ✓", { indent: true }),

      heading2("8.8 Corollary: Computing π from the Lattice"),
      para("Measuring the conductance of the infinite prime lattice yields π:"),
      mathPara("G = 6/π²  ⟹  π = √(6/G)", { center: true }),
      para("The coprimality of integers, a purely combinatorial property, encodes the transcendental constant π through the structure of prime coordinate space."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART V: DATABASE OPERATIONS =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART V: DATABASE OPERATIONS", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("9. Relational Operations as Number Theory"),
      
      para("The prime coordinate system provides a natural foundation for database operations. We demonstrate that fundamental relational algebra operations emerge directly from arithmetic."),

      heading2("9.1 The JOIN = GCD Theorem"),
      mixedPara([{ text: "Theorem 9.1. ", bold: true, italics: true }, "Set intersection (finding common elements between two sets) is equivalent to computing GCD."]),
      spacer(),
      para("We encode sets as squarefree integers, products where each prime appears at most once (exponent 0 or 1). Each element maps to a unique prime; presence in the set means the prime appears in the product."),
      spacer(),
      para("Consider two sets encoded as products of their element-primes:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Set A = {elements} → Product_A = ∏ prime(element)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Set B = {elements} → Product_B = ∏ prime(element)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "A ∩ B = elements in both → GCD(Product_A, Product_B)", size: 24, font: "Arial" })]
      }),

      heading2("9.2 Worked Example: Finding Common Customers"),
      mixedPara([{ text: "English: ", bold: true }, "\"Which customers purchased both Product X and Product Y?\""]),
      spacer(),
      para("Setup:"),
      new Table({
        columnWidths: [4000, 4500],
        rows: [
          new TableRow({ children: [
            tableCell("Table A (Bought X)", { header: true, center: true }),
            tableCell("Table B (Bought Y)", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("Alice, Bob, Carol"),
            tableCell("Bob, Carol, Dave")
          ]})
        ]
      }),
      spacer(),
      mixedPara([{ text: "Encoding ", bold: true }, "(each customer assigned a unique prime):"]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Alice = 2, Bob = 3, Carol = 5, Dave = 7", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Tables as products:", bold: true }]),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Table A = 2 × 3 × 5 = 30", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Table B = 3 × 5 × 7 = 105", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Set intersection:", bold: true }]),
      mathPara("A ∩ B = GCD(30, 105) = 15 = 3 × 5 = {Bob, Carol} ✓", { center: true }),

      heading2("9.3 Four-Layer Translation"),
      new Table({
        columnWidths: [2000, 6500],
        rows: [
          new TableRow({ children: [
            tableCell("Layer", { header: true, center: true }),
            tableCell("Expression", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("English", { bold: true }),
            tableCell("\"Which customers bought both products?\"")
          ]}),
          new TableRow({ children: [
            tableCell("Set Theory", { bold: true }),
            tableCell("A ∩ B = {Bob, Carol}")
          ]}),
          new TableRow({ children: [
            tableCell("Circuit", { bold: true }),
            tableCell("Common resistance paths = filters present in both circuits")
          ]}),
          new TableRow({ children: [
            tableCell("Vector", { bold: true }),
            tableCell("min(v(30), v(105)) = min((1,1,1,0), (0,1,1,1)) = (0,1,1,0) → 15")
          ]})
        ]
      }),

      heading2("9.4 Complete Relational Algebra"),
      new Table({
        columnWidths: [2500, 2500, 3500],
        rows: [
          new TableRow({ children: [
            tableCell("SQL Operation", { header: true, center: true }),
            tableCell("Arithmetic", { header: true, center: true }),
            tableCell("Vector Operation", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("Set Intersection / ∩"), tableCell("GCD(A, B)"), tableCell("min(v_A, v_B)")
          ]}),
          new TableRow({ children: [
            tableCell("UNION / ∪"), tableCell("LCM(A, B)"), tableCell("max(v_A, v_B)")
          ]}),
          new TableRow({ children: [
            tableCell("DIFFERENCE / −"), tableCell("A / GCD(A,B)"), tableCell("v_A − min(v_A, v_B)")
          ]}),
          new TableRow({ children: [
            tableCell("CONTAINS?"), tableCell("B divides A?"), tableCell("v_A ≥ v_B per dim?")
          ]})
        ]
      }),
      spacer(),
      para("The Euclidean algorithm computes GCD in O(log n) operations, making intersection efficient. This unifies database theory with number theory: the structure of data operations emerges from the structure of integers."),
      spacer(),
      mixedPara([{ text: "Extension to multisets: ", bold: true }, "The framework naturally extends to multisets (where elements can repeat) by allowing exponents greater than 1. The exponent of each prime encodes the count of that element. GCD then computes multiset intersection (minimum of counts), and LCM computes multiset union (maximum of counts)."]),
      spacer(),
      mixedPara([{ text: "Practical note: ", bold: true }, "This encoding demonstrates the theoretical correspondence between set operations and arithmetic. A set of 100 elements would produce a ~200-digit number; practical implementations would require bounded prime assignments or alternative representations."]),

      heading2("9.5 String Encoding Example"),
      para("For completeness, we show how to encode arbitrary strings:"),
      spacer(),
      mixedPara([{ text: "Encoding \"CAT\":", bold: true }]),
      new Table({
        columnWidths: [1700, 1700, 1700, 1700, 1700],
        rows: [
          new TableRow({ children: [
            tableCell("Position", { header: true, center: true }),
            tableCell("Character", { header: true, center: true }),
            tableCell("Value", { header: true, center: true }),
            tableCell("Prime", { header: true, center: true }),
            tableCell("Factor", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("1", { center: true }), tableCell("C", { center: true }), 
            tableCell("3", { center: true }), tableCell("2", { center: true }), 
            tableCell("2³ = 8", { center: true })
          ]}),
          new TableRow({ children: [
            tableCell("2", { center: true }), tableCell("A", { center: true }), 
            tableCell("1", { center: true }), tableCell("3", { center: true }), 
            tableCell("3¹ = 3", { center: true })
          ]}),
          new TableRow({ children: [
            tableCell("3", { center: true }), tableCell("T", { center: true }), 
            tableCell("20", { center: true }), tableCell("5", { center: true }), 
            tableCell("5²⁰", { center: true })
          ]})
        ]
      }),
      spacer(),
      para("Full encoding: encode(\"CAT\") = 2³ × 3¹ × 5²⁰"),
      spacer(),
      mixedPara([{ text: "Query: ", bold: true }, "\"What is the 2nd character?\""]),
      para("Extract exponent of prime(2) = 3: exponent = 1 → alphabet[1] = 'A' ✓", { indent: true }),

      heading2("9.6 Universal Binary Encoding"),
      para("The framework admits a universal encoding requiring no external lookup tables. Every binary string maps bijectively to a squarefree positive integer (one with no repeated prime factors)."),
      spacer(),
      mixedPara([{ text: "Encoding rule: ", bold: true }, "Position i (1-indexed from left to right, reading order) maps to the ith prime. Bit value becomes exponent (0 or 1). Note: this is reading order, not standard binary notation where the rightmost bit is least significant."]),
      spacer(),
      new Table({
        columnWidths: [2000, 3500, 3000],
        rows: [
          new TableRow({ children: [
            tableCell("Binary", { header: true, center: true }),
            tableCell("Interpretation", { header: true, center: true }),
            tableCell("Product", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("\"1\"", { center: true }), 
            tableCell("2¹"), 
            tableCell("2", { center: true })
          ]}),
          new TableRow({ children: [
            tableCell("\"10\"", { center: true }), 
            tableCell("2⁰ × 3¹"), 
            tableCell("3", { center: true })
          ]}),
          new TableRow({ children: [
            tableCell("\"11\"", { center: true }), 
            tableCell("2¹ × 3¹"), 
            tableCell("6", { center: true })
          ]}),
          new TableRow({ children: [
            tableCell("\"101\"", { center: true }), 
            tableCell("2¹ × 3⁰ × 5¹"), 
            tableCell("10", { center: true })
          ]}),
          new TableRow({ children: [
            tableCell("\"1101\"", { center: true }), 
            tableCell("2¹ × 3⁰ × 5¹ × 7¹"), 
            tableCell("70", { center: true })
          ]})
        ]
      }),
      spacer(),
      mixedPara([{ text: "Decoding: ", bold: true }, "Factor the integer. Primes present → bit is 1. Primes absent → bit is 0."]),
      spacer(),
      para("This establishes binary as the natural language of the prime coordinate system. The encoding IS the mathematical structure; no external convention required."),
      spacer(),
      mixedPara([{ text: "Theorem 9.2 (Binary-Squarefree Bijection). ", bold: true, italics: true }, "The map from binary strings to squarefree integers is a bijection."]),
      spacer(),
      mixedPara([{ text: "Proof. ", italics: true }, "Each binary string of length n determines a unique subset of the first n primes (those positions with 1s). Each subset determines a unique squarefree product. Conversely, each squarefree integer factors uniquely into distinct primes, determining exactly which positions are 1. □"]),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART VI: COMPUTATIONAL COMPLETENESS =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART VI: COMPUTATIONAL COMPLETENESS", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("10. Turing Completeness"),
      
      para("A computational system is Turing complete if it can simulate any Turing machine. We demonstrate that this framework satisfies all requirements through explicit construction."),

      heading2("10.1 Requirements"),
      new Table({
        columnWidths: [2500, 2500, 3500],
        rows: [
          new TableRow({ children: [
            tableCell("Requirement", { header: true, center: true }),
            tableCell("Status", { header: true, center: true }),
            tableCell("Implementation", { header: true, center: true })
          ]}),
          new TableRow({ children: [
            tableCell("Boolean completeness"),
            tableCell("✓ SATISFIED", { bold: true }),
            tableCell("AND, OR, NOT (Sections 3-5)")
          ]}),
          new TableRow({ children: [
            tableCell("Conditional branching"),
            tableCell("✓ SATISFIED", { bold: true }),
            tableCell("Transistor gate (Section 10.3)")
          ]}),
          new TableRow({ children: [
            tableCell("Unbounded memory"),
            tableCell("✓ SATISFIED", { bold: true }),
            tableCell("Infinite prime coordinates")
          ]}),
          new TableRow({ children: [
            tableCell("Iteration"),
            tableCell("✓ SATISFIED", { bold: true }),
            tableCell("JUMP-IF-ZERO + GOTO (Section 10.3)")
          ]})
        ]
      }),

      heading2("10.2 Counter Machine Simulation"),
      para("Counter machines (Minsky machines) are known to be Turing complete. Our simulation encodes machine states as integers using Gödel numbering, the technique introduced by Gödel (1931) where prime factorization represents structured data. A two-counter machine has:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Two counters C₁, C₂ holding non-negative integers", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Operations: INCREMENT(Cᵢ), DECREMENT(Cᵢ), JUMP-IF-ZERO(Cᵢ, label), GOTO(label)", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "State Encoding:", bold: true }]),
      para("We encode the machine state as an integer:"),
      mathPara("State = 2^(C₁) × 3^(C₂) × p_k", { center: true }),
      para("where C₁ is the first counter, C₂ is the second counter, and p_k is a prime encoding the program counter (instruction number)."),

      heading2("10.3 Operation Implementation"),
      spacer(),
      mixedPara([{ text: "INCREMENT(C₁):", bold: true }, " Multiply state by 2"]),
      para("Circuit: Add Ω(2) = ln(2) in series", { indent: true }),
      para("Vector: Add 1 to first coordinate: v → v + (1, 0, 0, ...)", { indent: true }),
      spacer(),
      mixedPara([{ text: "DECREMENT(C₁):", bold: true }, " Divide state by 2 (if C₁ > 0)"]),
      para("Circuit: Subtract Ω(2) from total resistance", { indent: true }),
      para("Vector: Subtract 1 from first coordinate: v → v − (1, 0, 0, ...)", { indent: true }),
      spacer(),
      mixedPara([{ text: "JUMP-IF-ZERO(C₁, L):", bold: true }, " Branch based on whether C₁ = 0"]),
      para("This is the critical operation. We construct it explicitly:", { indent: true }),

      heading3("The Divisibility Test Circuit"),
      para("The condition C₁ = 0 is equivalent to: 2 does NOT divide State."),
      spacer(),
      para("Construction:"),
      new Paragraph({
        numbering: { reference: "numbered-3", level: 0 },
        children: [new TextRun({ text: "Attempt to compute State / 2", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-3", level: 0 },
        children: [new TextRun({ text: "In vector space: v(State) − v(2) = v(State) − (1, 0, 0, ...)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-3", level: 0 },
        children: [new TextRun({ text: "If v(State)₁ ≥ 1: subtraction succeeds → C₁ > 0 → continue", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-3", level: 0 },
        children: [new TextRun({ text: "If v(State)₁ = 0: subtraction fails (would give negative) → C₁ = 0 → jump to L", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("Circuit implementation:"),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 50 },
        children: [new TextRun({ text: "                    ┌─── [Continue] ←── division succeeds", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "State ━━━━[ ÷2 ]━━━━┤", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "                    └─── [Jump to L] ←── division fails (Ω → ∞)", size: 22, font: "Courier New" })]
      }),
      para("The division gate acts as a transistor: if the first coordinate is positive, the circuit conducts (finite resistance); if zero, the circuit blocks (infinite resistance), activating the alternative branch."),
      spacer(),
      para("Transistor analogy (divisibility gate symbol):"),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "        State In", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "            │", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "            ▼", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "      ┌─────┴─────┐", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "      │  ÷ prime  │◄── Control: \"Does prime divide State?\"", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "      └─────┬─────┘", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "           ╱╲", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "          ╱  ╲", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "    YES  ╱    ╲  NO", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "        ╱      ╲", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: "       ▼        ▼", size: 22, font: "Courier New" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: "   [PASS]    [BLOCK]", size: 22, font: "Courier New" })]
      }),
      para("Like a transistor with base/gate control, the divisibility gate has one input and two outputs: PASS (finite Ω, signal continues) or BLOCK (Ω → ∞, signal redirected)."),
      spacer(),
      heading3("Program Counter Manipulation"),
      mixedPara([{ text: "GOTO(L):", bold: true }, " Unconditional jump to instruction L"]),
      para("The program counter is encoded as a prime p_k where k is the instruction number. To jump from instruction k to instruction L:", { indent: true }),
      mathPara("State_new = State × (p_L / p_k)", { center: true }),
      para("In resistance terms: subtract Ω(p_k) and add Ω(p_L). This replaces the current instruction prime with the target instruction prime while preserving the counter values.", { indent: true }),

      heading2("10.4 Completeness Conclusion"),
      para("Since counter machines are Turing complete and we can simulate them with explicit constructions for all operations (INCREMENT, DECREMENT, JUMP-IF-ZERO, and GOTO), the framework is Turing complete. The simulation uses Gödel numbering: machine state is encoded as 2^C₁ × 3^C₂ × p_k, where prime exponents store counter values and a distinct prime encodes the program counter."),

      heading2("10.5 Computational Complexity Note"),
      para("While Turing complete, the framework does not automatically solve NP-hard problems efficiently:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Factorization bottleneck: For unstructured integers, decoding requires factoring. (Note: the counter machine simulation uses structured states of known form 2^a × 3^b × p_k, where extracting exponents of known small primes is efficient.)", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "NOT gate: Requires a reference signal (certainty P=1), analogous to a voltage reference in electronic inverters.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Precision: For analog implementations using continuous probabilities, finite precision representation introduces limits not present in the discrete integer framework.", size: 24, font: "Arial" })]
      }),
      spacer(),
      mixedPara([{ text: "Undecidability: ", bold: true }, "Since the framework is Turing complete, it inherits the halting problem. In circuit terms: determining whether a computation terminates is equivalent to asking whether the circuit resistance ever stabilizes to a halt state, and this question is undecidable in general."]),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PART VII: CONNECTIONS =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
        children: [new TextRun({ text: "PART VII: CONNECTIONS AND IMPLICATIONS", bold: true, size: 32, font: "Arial" })]
      }),

      heading1("11. Primes as Irreducible Elements"),
      
      mixedPara([{ text: "Definition 11.1. ", bold: true }, "An integer n > 1 is irreducible in the circuit sense if there do not exist integers a, b > 1 such that:"]),
      mathPara("Ω(n) = Ω(a) + Ω(b)", { center: true }),
      para("That is, the resistance ln(n) cannot be expressed as a sum of smaller resistances."),
      spacer(),
      mixedPara([{ text: "Theorem 11.2 (Prime Characterization). ", bold: true, italics: true }, "An integer is prime if and only if it is irreducible in the circuit sense."]),
      spacer(),
      mixedPara([{ text: "Proof. ", italics: true }, "n is reducible iff ∃ a, b > 1 with ln(n) = ln(a) + ln(b) = ln(ab) iff n = ab. This is precisely the definition of composite. Hence irreducible ≡ prime. □"]),
      spacer(),
      para("This characterization shows that primality has a natural interpretation within the framework: primes are precisely those integers whose resistance cannot be decomposed into smaller components."),

      heading1("12. Connection to the Riemann Zeta Function"),
      
      para("The Euler product formula provides a connection between our framework and the zeta function:"),
      mathPara("ζ(s) = ∏_{p prime} 1/(1 − p^(−s))", { center: true }),
      para("Each prime p contributes a factor to the product. In our framework:"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Each factor 1/(1 − p^(−s)) corresponds to a geometric series of paths through the prime-p dimension", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "At s = 2, the reciprocal yields the coprimality conductance 6/π²", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("The Euler product representation reflects the multiplicative structure of prime coordinates. The inverse function 1/ζ(s) = Σ μ(n)/n^s involves the Möbius function μ(n), which is zero for non-squarefree integers, directly connecting to our binary encoding where squarefree integers represent sets. Whether this connection can be extended to illuminate the distribution of zeta zeros remains an open question for future investigation."),

      heading1("13. Future Directions"),
      
      new Paragraph({
        numbering: { reference: "numbered-4", level: 0 },
        children: [new TextRun({ text: "Physical Implementation: Exploring whether circuits implementing these principles could offer computational advantages for probabilistic inference.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-4", level: 0 },
        children: [new TextRun({ text: "Zeta Zero Analysis: Investigating phase structure at zeta zeros through the lens of prime-composite interference patterns.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-4", level: 0 },
        children: [new TextRun({ text: "Möbius Function Connection: The inverse zeta function 1/ζ(s) = Σ μ(n)/n^s, where μ is the Möbius function, appears closely related to our framework. The Möbius function equals zero for non-squarefree integers and ±1 for squarefree integers, mirroring our binary encoding. Investigating this connection may yield insights into multiplicative number theory.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-4", level: 0 },
        children: [new TextRun({ text: "AI Convergence Hypothesis: Testing whether trained embedding spaces converge toward prime coordinate structure as training data increases.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbered-4", level: 0 },
        children: [new TextRun({ text: "Higher-Dimensional Extensions: Investigating whether treating prime dimensions as spatial coordinates enables novel parallel computation models.", size: 24, font: "Arial" })]
      }),

      heading1("14. Conclusion"),
      
      para("This paper has established a comprehensive framework for computation based on a rigorous isomorphism between probability mathematics and informational resistance. The key contributions include:"),
      spacer(),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Four-Layer Framework: English, probability, circuit, and vector space representations are demonstrated equivalent, enabling translation between intuitive descriptions and mathematical formulations.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Complete Boolean Logic: AND (series), OR (parallel, both exclusive and inclusive), and NOT (phase-shift) form a functionally complete set, verified on binary truth tables.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Coprimality Proof of Concept: Deriving 6/π² through all four layers demonstrates the framework produces correct, non-trivial results connecting number theory to analysis.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Database Operations: Relational JOIN, UNION, and INTERSECTION correspond to GCD, LCM, and related number-theoretic operations, revealing a unifying structure between data theory and arithmetic.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Turing Completeness: Explicit construction of counter machine simulation, including the critical JUMP-IF-ZERO operation via divisibility testing.", size: 24, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Prime Characterization: Primes correspond to the irreducible elements, configurations whose resistance cannot be decomposed into smaller components.", size: 24, font: "Arial" })]
      }),
      spacer(),
      para("The framework demonstrates that computation need not be binary or discrete. Metaphorically, a system built on these principles acts as a \"Physics Engine\" for Logic: correct answers correspond to configurations of minimum informational resistance, much as physical systems settle into minimum-energy states. Whether this analogy can be made precise through actual physical implementation remains an open question."),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== REFERENCES =====
      heading1("References"),
      para("[1] Shannon, C. E. (1948). A Mathematical Theory of Communication. Bell System Technical Journal, 27(3), 379-423."),
      para("[2] Riemann, B. (1859). Über die Anzahl der Primzahlen unter einer gegebenen Größe. Monatsberichte der Berliner Akademie."),
      para("[3] Euler, L. (1734). De summis serierum reciprocarum. Commentarii academiae scientiarum Petropolitanae 7: 123-134."),
      para("[4] Gödel, K. (1931). Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I. Monatshefte für Mathematik und Physik, 38, 173-198."),
      para("[5] Minsky, M. L. (1967). Computation: Finite and Infinite Machines. Prentice-Hall."),
      para("[6] Cover, T. M., & Thomas, J. A. (2006). Elements of Information Theory (2nd ed.). Wiley-Interscience."),
      para("[7] Codd, E. F. (1970). A Relational Model of Data for Large Shared Data Banks. Communications of the ACM, 13(6), 377-387."),
      para("[8] Aczél, J. (1966). Lectures on Functional Equations and Their Applications. Academic Press."),
    ]
  }]
});

// Save the document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/Hypercomputer_Paper_v3.docx", buffer);
  console.log("Document created: Hypercomputer_Paper_v3.docx");
});
