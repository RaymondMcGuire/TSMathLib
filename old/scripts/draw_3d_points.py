from mpl_toolkits.mplot3d import Axes3D 

import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

xArray = [0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0.125,0.375,0.625,0.875,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1,0,0.25,0.5,0.75,1]
yArray = [0,0,0,0,0,0.25,0.25,0.25,0.25,0.25,0.5,0.5,0.5,0.5,0.5,0.75,0.75,0.75,0.75,0.75,1,1,1,1,1,0.125,0.125,0.125,0.125,0.375,0.375,0.375,0.375,0.625,0.625,0.625,0.625,0.875,0.875,0.875,0.875,0,0,0,0,0,0.25,0.25,0.25,0.25,0.25,0.5,0.5,0.5,0.5,0.5,0.75,0.75,0.75,0.75,0.75,1,1,1,1,1,0.125,0.125,0.125,0.125,0.375,0.375,0.375,0.375,0.625,0.625,0.625,0.625,0.875,0.875,0.875,0.875,0,0,0,0,0,0.25,0.25,0.25,0.25,0.25,0.5,0.5,0.5,0.5,0.5,0.75,0.75,0.75,0.75,0.75,1,1,1,1,1,0.125,0.125,0.125,0.125,0.375,0.375,0.375,0.375,0.625,0.625,0.625,0.625,0.875,0.875,0.875,0.875,0,0,0,0,0,0.25,0.25,0.25,0.25,0.25,0.5,0.5,0.5,0.5,0.5,0.75,0.75,0.75,0.75,0.75,1,1,1,1,1,0.125,0.125,0.125,0.125,0.375,0.375,0.375,0.375,0.625,0.625,0.625,0.625,0.875,0.875,0.875,0.875,0,0,0,0,0,0.25,0.25,0.25,0.25,0.25,0.5,0.5,0.5,0.5,0.5,0.75,0.75,0.75,0.75,0.75,1,1,1,1,1]
zArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.375,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.625,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,0.875,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
_marker = 'o'
ax.scatter(xArray, yArray, zArray, marker=_marker)

ax.set_xlabel('X Label')
ax.set_ylabel('Y Label')
ax.set_zlabel('Z Label')

plt.show()