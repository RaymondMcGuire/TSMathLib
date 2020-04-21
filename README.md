# TSMathLib
A math library developed by Typescript.

## Getting Started
yarn install

## Method
### Data Type
* N-dimensions Vector
* M * N Matrix
* Sparse Matrix
* Quaternion

### Data Structure
* HashSet

### Algorithm
- Solve a linear equation Ax = b
  - Conjugate Gradient Method
  - Gaussian Elimination
  - Cramer's Rule
- Gram Schmidt Process Method

### Demo
- [SPH Kernel](https://raymondmcguire.github.io/TSMathLib/examples/sph_kernel_demo/)
- [Simple SPH Online Version](https://raymondmcguire.github.io/TSMathLib/examples/sph/)
### Application
- [Poisson Image Editing(SIGGRAPH 2003)](https://raymondmcguire.github.io/EcognitaMathLib/build/ "Poisson Image Editing")
![Poisson Image Editing](./build/images/poisson_image_editing_demo.gif?raw=true "Poisson Image Editing")

## Commands for Typescript
- develop: yarn run watch
- build: yarn run build
- check code: yarn run check
- fix tslint: yarn run tslint-fix
- delete node_modules: rimraf node_modules 
- npm update check: ncu -> ncu -u -> npm install
## Reference
* Pérez, Patrick, Michel Gangnet, and Andrew Blake. "Poisson image editing." ACM Transactions on graphics (TOG) 22.3 (2003): 313-318.
* M. Becker and M. Teschner, Weakly Compressible SPH for Free Furface Flows, In Proc. SCA2007, pp.209-217, 2007.
* M. Desbrun and M.-P. Cani, Smoothed Particles: A New Paradigm for Animating Highly Deformable Bodies, Eurographics Workshop on Computer Animation and Simulation (EGCAS), pp.61-76. 1996.
* Dan Koschier, Jan Bender. Smoothed Particle Hydrodynamics Techniques for the Physics Based Simulation of Fluids and Solids, Eurographics Tutorial 2019.
* Muller M, Charypar D, Gross M. Particle-based fluid simulation for interactive applications, Proceedings of the 2003 ACM SIGGRAPH/Eurographics symposium on Computer animation. Eurographics Association, 2003: 154-159.
