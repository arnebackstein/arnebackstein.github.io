export class Matrix{
    constructor() {
        this.mat = new Float32Array([
            1., 0., 0., 0.,
            0., 1., 0., 0.,
            0., 0., 1., 0.,
            0., 0., 0., 1.,
        ]);
    }

    translate(x,y,z) {
        this.mat[12] += this.mat[0]*x + this.mat[4]*y + this.mat[8]*z;
        this.mat[13] += this.mat[1]*x + this.mat[5]*y + this.mat[9]*z;
        this.mat[14] += this.mat[2]*x + this.mat[6]*y + this.mat[10]*z;
        this.mat[15] += this.mat[3]*x + this.mat[7]*y + this.mat[11]*z;
    }

    /**
     * rotating the matrix by the angle rad
     * around the unit vector v
     *
     * if the vector provided is not unit scale
     * it is rescaled to unit size 1
      */
    rotate(rad, v){
        let l = v[0];
        let m = v[1];
        let n = v[2];

        let mat00, mat01, mat02, mat03;
        let mat10, mat11, mat12, mat13;
        let mat20, mat21, mat22, mat23;

        // rescale to unit size
        const hypot = Math.hypot(l,m,n);
        l /= hypot;
        m /= hypot;
        n /= hypot;

        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const t = 1.-c;

        let rMat = new Float32Array([
            l*l*t + c,      m*l*t - n*s,    n*l*t + m*s,
            l*m*t + n*s,    m*m*t + c,      n*m*t - l*s,
            l*n*t - m*s,    m*n*t + l*s,    n*n*t + c,
        ]);


        mat00 = this.mat[0];
        mat01 = this.mat[1];
        mat02 = this.mat[2];
        mat03 = this.mat[3];
        mat10 = this.mat[4];
        mat11 = this.mat[5];
        mat12 = this.mat[6];
        mat13 = this.mat[7];
        mat20 = this.mat[8];
        mat21 = this.mat[9];
        mat22 = this.mat[10];
        mat23 = this.mat[11];

        this.mat[0] = mat00 * rMat[0] + mat10 * rMat[1] + mat20 * rMat[2];
        this.mat[1] = mat01 * rMat[0] + mat11 * rMat[1] + mat21 * rMat[2];
        this.mat[2] = mat02 * rMat[0] + mat12 * rMat[1] + mat22 * rMat[2];
        this.mat[3] = mat03 * rMat[0] + mat13 * rMat[1] + mat23 * rMat[2];

        this.mat[4] = mat00 * rMat[3] + mat10 * rMat[4] + mat20 * rMat[5];
        this.mat[5] = mat01 * rMat[3] + mat11 * rMat[4] + mat21 * rMat[5];
        this.mat[6] = mat02 * rMat[3] + mat12 * rMat[4] + mat22 * rMat[5];
        this.mat[7] = mat03 * rMat[3] + mat13 * rMat[4] + mat23 * rMat[5];

        this.mat[8] = mat00 * rMat[6] + mat10 * rMat[7] + mat20 * rMat[8];
        this.mat[9] = mat01 * rMat[6] + mat11 * rMat[7] + mat21 * rMat[8];
        this.mat[10]= mat02 * rMat[6] + mat12 * rMat[7] + mat22 * rMat[8];
        this.mat[11]= mat03 * rMat[6] + mat13 * rMat[7] + mat23 * rMat[8];
    }
}





