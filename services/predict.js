import tf from "https://deno.land/x/tensorflow/tf.js";


// Función para rellenar secuencias con ceros
function padSequences (array, size) {
    const [newArray] = array
    const diff = size - newArray.length
    const zeros = new Array(diff).fill(0)
    return [[...zeros, ...newArray]]
  }
  
  // Función para cargar el modelo
  async function loadModel () {
    const model = await tf.loadLayersModel('../model/nwp.json')
    return model
  }
  
  async function loadVocab () {
    const vocab = await import("../model/vocab.json", { with: { type: "json" } });
    return vocab.default
  }
  
  // Función para cargar el tokenizer
  async function loadTokenizer () {
    const tokenizerData = await import ("../model/tokenizer.json", { with: { type: "json" } });
    const tokenizerDataJson = tokenizerData.default
    console.log(tokenizerDataJson.config)
    const wordIndex = 'tokenizerDataJson.word_index'
    const numWords = 'tokenizerDataJson.config.num_words'
    const oovToken = 'tokenizerDataJson.config.oov_token'
  
    return {
      wordIndex,
      numWords,
      oovToken,
      textsToSequences (texts) {
        return texts.map(text =>
          text
            .split(' ')
            .map(word => wordIndex[word] || oovToken)
            .filter(word => word !== null)
        )
      }
    }
  }
  
//   // Función para hacer predicciones
//   async function makePrediction (text, nWords) {
//     const tokenizer = await loadTokenizer()
//     const vocabArray = await loadVocab()
  
//     const model = await loadModel()
  
//     for (let i = 0; i < nWords; i++) {
//       const textTokenize = tokenizer.textsToSequences([text])
//       const textPadded = padSequences(textTokenize, 14)
//       const tensorData = tf.tensor(textPadded)
//       const prediction = model.predict(tensorData)
//       const predictionArgmax = tf.argMax(prediction, -1)
//       const predictionValue = await predictionArgmax.data()
//       const predictionIndex = predictionValue[0]
//       const predictedWord = vocabArray[predictionIndex - 1]
//       text += ' ' + predictedWord
//     }
//     return text
//   }

  export const predict = async text => {
    // const prediction = await makePrediction(text, 1)
    const prediction = 'prediction'
    return prediction
  }

// loadModel().then(model => {
//     console.log('Model loaded')
//   }
//     )

// console.log(tf)