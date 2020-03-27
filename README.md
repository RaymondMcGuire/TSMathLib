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
