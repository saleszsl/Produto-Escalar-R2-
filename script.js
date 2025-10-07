document.addEventListener('DOMContentLoaded', () => {
    // --- FUNÇÕES AUXILIARES DA CALCULADORA ---
    function parseVector(str) {
        if (!str || typeof str !== 'string') return [];
        const cleanedStr = str.replace(/[\[\]\s]/g, '');
        if (!cleanedStr) return [];
        return cleanedStr.split(',').map(Number).filter(n => !isNaN(n));
    }

    const formatVector = (vec) => `[${vec.map(n => n.toFixed(3)).join(', ')}]`;

    // --- CARD 1: ANÁLISE DE VETOR ÚNICO ---
    const singleVectorInput = document.getElementById('single-vector-input');
    const checkNullBtn = document.getElementById('check-null-btn');
    const calcUnitBtn = document.getElementById('calc-unit-btn');
    const singleVectorResult = document.getElementById('single-vector-result');

    checkNullBtn.addEventListener('click', () => {
        try {
            const vec = parseVector(singleVectorInput.value);
            if (vec.length === 0) throw new Error("Vetor inválido ou vazio.");
            const isNull = vec.every(component => component === 0);
            singleVectorResult.textContent = `O vetor ${formatVector(vec)} ${isNull ? 'É' : 'NÃO é'} um vetor nulo.`;
        } catch (e) {
            singleVectorResult.textContent = `Erro: ${e.message}`;
        }
    });

    calcUnitBtn.addEventListener('click', () => {
        try {
            const vec = parseVector(singleVectorInput.value);
            if (vec.length === 0) throw new Error("Vetor inválido ou vazio.");
            
            const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
            if (magnitude === 0) {
                throw new Error("Não é possível calcular o vetor unitário de um vetor nulo.");
            }

            const unitVector = vec.map(val => val / magnitude);
            singleVectorResult.textContent = `Vetor Original: ${formatVector(vec)}\nMódulo: ${magnitude.toFixed(3)}\nVetor Unitário: ${formatVector(unitVector)}`;
        } catch (e) {
            singleVectorResult.textContent = `Erro: ${e.message}`;
        }
    });

    // --- CARD 2: COMPARAÇÃO ENTRE VETORES ---
    const compareVectorAInput = document.getElementById('compare-vector-a');
    const compareVectorBInput = document.getElementById('compare-vector-b');
    const checkEqualBtn = document.getElementById('check-equal-btn');
    const checkOppositeBtn = document.getElementById('check-opposite-btn');
    const checkCollinearBtn = document.getElementById('check-collinear-btn');
    const compareVectorsResult = document.getElementById('compare-vectors-result');

    checkEqualBtn.addEventListener('click', () => {
        try {
            const vecA = parseVector(compareVectorAInput.value);
            const vecB = parseVector(compareVectorBInput.value);
            if (vecA.length === 0 || vecB.length === 0) throw new Error("Um ou ambos os vetores são inválidos.");
            if (vecA.length !== vecB.length) throw new Error("Vetores devem ter a mesma dimensão para serem iguais.");

            const areEqual = vecA.every((val, i) => val === vecB[i]);
            compareVectorsResult.textContent = `Os vetores ${areEqual ? 'SÃO' : 'NÃO são'} iguais.`;
        } catch (e) {
            compareVectorsResult.textContent = `Erro: ${e.message}`;
        }
    });

    checkOppositeBtn.addEventListener('click', () => {
        try {
            const vecA = parseVector(compareVectorAInput.value);
            const vecB = parseVector(compareVectorBInput.value);
            if (vecA.length === 0 || vecB.length === 0) throw new Error("Um ou ambos os vetores são inválidos.");
            if (vecA.length !== vecB.length) throw new Error("Vetores devem ter a mesma dimensão para serem opostos.");

            const areOpposite = vecA.every((val, i) => val === -vecB[i]);
            compareVectorsResult.textContent = `Os vetores ${areOpposite ? 'SÃO' : 'NÃO são'} opostos.`;
        } catch (e) {
            compareVectorsResult.textContent = `Erro: ${e.message}`;
        }
    });

    checkCollinearBtn.addEventListener('click', () => {
        try {
            const vecA = parseVector(compareVectorAInput.value);
            const vecB = parseVector(compareVectorBInput.value);
            if (vecA.length === 0 || vecB.length === 0) throw new Error("Um ou ambos os vetores são inválidos.");
            if (vecA.length !== vecB.length) throw new Error("Vetores devem ter a mesma dimensão para serem colineares.");

            // Encontra o primeiro componente não nulo para achar a razão k
            const firstNonZeroIndex = vecA.findIndex(val => val !== 0);
            if (firstNonZeroIndex === -1) { // vecA é nulo
                compareVectorsResult.textContent = "São colineares (vetor nulo é colinear a qualquer outro).";
                return;
            }
            const k = vecB[firstNonZeroIndex] / vecA[firstNonZeroIndex];
            const areCollinear = vecA.every((val, i) => Math.abs(val * k - vecB[i]) < 1e-9); // Tolerância para float

            compareVectorsResult.textContent = `Os vetores ${areCollinear ? 'SÃO' : 'NÃO são'} colineares.`;
        } catch (e) {
            compareVectorsResult.textContent = `Erro: ${e.message}`;
        }
    });

    // --- CARD 3: OPERAÇÕES COM MÚLTIPLOS VETORES ---
    const multiVectorInput = document.getElementById('multi-vector-input');
    const calcResultantBtn = document.getElementById('calc-resultant-btn');
    const calcEquilibrantBtn = document.getElementById('calc-equilibrant-btn');
    const multiVectorResult = document.getElementById('multi-vector-result');

    const calculateSum = () => {
        const lines = multiVectorInput.value.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) throw new Error("Nenhum vetor inserido.");

        const vectors = lines.map(parseVector);
        const dimension = vectors[0].length;
        if (dimension === 0) throw new Error("Vetor na primeira linha é inválido.");
        if (!vectors.every(v => v.length === dimension)) {
            throw new Error("Todos os vetores devem ter a mesma dimensão.");
        }

        const resultant = new Array(dimension).fill(0);
        for (const vec of vectors) {
            for (let i = 0; i < dimension; i++) {
                resultant[i] += vec[i];
            }
        }
        return resultant;
    };

    calcResultantBtn.addEventListener('click', () => {
        try {
            const resultant = calculateSum();
            multiVectorResult.textContent = `Vetor Resultante: ${formatVector(resultant)}`;
        } catch (e) {
            multiVectorResult.textContent = `Erro: ${e.message}`;
        }
    });

    calcEquilibrantBtn.addEventListener('click', () => {
        try {
            const resultant = calculateSum();
            const equilibrant = resultant.map(val => -val);
            multiVectorResult.textContent = `Vetor Equilibrante: ${formatVector(equilibrant)}`;
        } catch (e) {
            multiVectorResult.textContent = `Erro: ${e.message}`;
        }
    });
});
