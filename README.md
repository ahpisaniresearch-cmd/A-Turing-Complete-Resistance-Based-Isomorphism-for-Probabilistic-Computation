# A Turing-Complete Resistance-Based Isomorphism for Probabilistic Computation

**Author:** Alexander Pisani  
**Contact:** a.h.pisani.research@gmail.com  
**Date:** December 2025  
**Status:** Submitted for Review
[![DOI](https://zenodo.org/badge/1108883418.svg)](https://doi.org/10.5281/zenodo.17797151)



## Abstract

This paper establishes a rigorous isomorphism between probability mathematics and informational resistance. The fundamental translation Ω(P) = −ln(P) maps probability to resistance, transforming multiplication into addition. This correspondence extends across four equivalent representations (natural language, probability theory, circuit topology, and prime coordinate vectors) which function as a Rosetta Stone for discrete mathematics: the same computation can be expressed in any layer and translated exactly to the others.

Boolean logic emerges from circuit topology: AND as series (resistances add), OR as parallel (conductances add), and NOT as phase interference. We prove the framework's validity through two complete worked examples. First, we derive the probability that two random integers are coprime, obtaining the known result 6/π² by traversing all four representation layers. Second, we demonstrate that relational database operations (JOIN, UNION, INTERSECTION) map directly to number-theoretic operations (GCD, LCM). We establish Turing completeness by constructing an explicit simulation of counter machines using prime exponents as registers.

The framework reveals that prime numbers are precisely the irreducible elements of this informational structure, configurations whose resistance cannot be decomposed into sums of smaller resistances. This characterization, combined with the Gödel-style encoding of data through prime coordinates, suggests that any sufficiently powerful computational system must rediscover the primes as a structural necessity.

## Repository Contents

| File | Description |
|------|-------------|
| `Turing_Complete_Resistance_Isomorphism.pdf` | The complete paper (PDF format) |
| `Turing_Complete_Resistance_Isomorphism.docx` | The complete paper (Word format) |
| `create_paper.js` | Node.js script to generate the paper programmatically |

## Key Contributions

1. **Fundamental Isomorphism:** Ω(P) = −ln(P) maps probability to informational resistance, preserving algebraic structure (monoid isomorphism from multiplication to addition).

2. **Four-Layer Framework:** Every computation can be expressed equivalently in:
   - Natural language
   - Probability theory
   - Circuit topology (resistors/conductors)
   - Prime coordinate vectors

3. **Complete Boolean Logic:**
   - AND = Series circuits (resistances add)
   - OR = Parallel circuits (conductances add)
   - NOT = Phase-shift interference

4. **Turing Completeness:** Explicit construction of counter machine simulation using Gödel numbering with prime exponents as registers.

5. **Proof of Concept:** Derivation of the coprimality theorem P(gcd(a,b)=1) = 6/π² through all four representation layers.

6. **Database Operations:** Set intersection, union, and difference correspond to GCD, LCM, and quotient operations on prime-encoded sets.

7. **Prime Characterization:** Primes are precisely the irreducible elements of the informational resistance structure.

## Mathematical Foundation

The core insight is that probability multiplication maps onto resistance addition:

```
P(A ∩ B) = P(A) × P(B)     [Probability domain]
Ω(A ∩ B) = Ω(A) + Ω(B)     [Resistance domain]
```

The logarithm mediates between domains:
```
Ω(P) = −ln(P)
P = e^(−Ω)
```

This is not analogy but exact isomorphism, verified through:
- Binary truth table verification (AND, OR, NOT)
- Probabilistic computation (Red Ace example)
- Number-theoretic derivation (6/π² coprimality)
- Database query execution (GCD/LCM operations)

## Building from Source

The paper is generated programmatically using Node.js and the `docx` library:

```bash
npm install docx
node create_paper.js
```

This produces `Hypercomputer_Paper_v3.docx` which can be converted to PDF.

## Citation

If you find this work useful, please cite:

```
Pisani, A. (2025). A Turing-Complete Resistance-Based Isomorphism 
for Probabilistic Computation. Preprint.
```

## License

This work is made available for academic and research purposes. Please contact the author for other uses.

## Acknowledgments

This research draws on foundational work by Shannon (information theory), Euler (prime products and zeta function), Gödel (arithmetization of logic), and Minsky (counter machines).
