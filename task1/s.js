// Define global variables for storing the original signal and sampled points
let originalSignal = [];
let sampledPoints = [];

// Define global variables for storing the sampling frequency and maximum frequency
let samplingFreq = 0;
let maxFreq = 0;

// Define a function to load the signal from a file and update the UI
function loadSignalFromFile() {
  const fileInput = document.getElementById('signal-file-input');

  if (fileInput.files.length === 0) {
    console.error('No file selected');
    return;
  }

  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = (event) => {
    const signalData = event.target.result;
    // Process the signal data as needed
    console.log(signalData);
  };
  reader.readAsText(file);
}

  // create an input element of type file
const input = document.createElement('input');
input.type = 'file';

// add an event listener to the input element
input.addEventListener('change', () => {
  // create a new FileReader object
  const reader = new FileReader();

  // set the callback function for when the file is loaded
  reader.onload = () => {
    // the signal is stored in the reader's result property
    const signal = reader.result;
    console.log(signal);
  };

  // read the file as a text file
  reader.readAsText(input.files[0]);
});

// add the input element to the document
document.body.appendChild(input);

  // Update the UI to display the original signal
  updateOriginalSignalGraph(originalSignal);


// Define a function to sample the signal at the given frequency and update the UI
function sampleSignal(frequency) {
  // Sample the signal at the given frequency
  sampledPoints = sample(originalSignal, frequency);

  // Update the UI to display the sampled points and sampling frequency
  updateSampledPointsGraph(sampledPoints, frequency);
}

// Define a function to recover the original signal from the sampled points and update the UI
function recoverSignal() {
  // Recover the original signal from the sampled points
  let recoveredSignal = interpolate(sampledPoints);

  // Update the UI to display the recovered signal and the difference between the original and recovered signals
  updateRecoveredSignalGraph(recoveredSignal);
  updateDifferenceGraph(originalSignal, recoveredSignal);
}


function plotLineChart(canvas, labels, data, label, color) {
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (s)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Amplitude'
          }
        }]
      }
    }
  });
}



// Define a function to update the original signal graph
function updateOriginalSignalGraph(signal) {
  // TODO: Implement code to update the original signal graph using a library like Chart.js or D3.js
  // create a new Chart object
const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // x-axis labels
      datasets: [{
        label: 'Signal',
        data: [], // initial signal data
        borderColor: 'blue',
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (s)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Amplitude'
          }
        }]
      }
    }
  });

  
  
  // update the chart with new signal data
  function updateChart(signalData) {
    // update the dataset's data property with the new signal data
    chart.data.datasets[0].data = signalData;
  
    // update the x-axis labels with the appropriate time values
    const labels = [];
    for (let i = 0; i < signalData.length; i++) {
      labels.push(i); // assume each data point represents 1 second
    }
    chart.data.labels = labels;
  
    // re-render the chart with the new data
    chart.update();
  }
  
}

// Define a function to update the sampled points graph
function updateSampledPointsGraph(points, frequency) {
  // TODO: Implement code to update the sampled points graph using a library like Chart.js or D3.js
  // create a new Chart object
const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Sampled Points',
        data: [], // initial sampled points data
        borderColor: 'red',
        backgroundColor: 'red'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (s)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Amplitude'
          }
        }]
      }
    }
  });
  
  // update the chart with new sampled points data
  function updateChart(sampledPointsData) {
    // update the dataset's data property with the new sampled points data
    chart.data.datasets[0].data = sampledPointsData;
  
    // re-render the chart with the new data
    chart.update();
  }
  
  // Display the sampling frequency in either actual frequency or normalized one
  let freqDisplay = frequency;
  if (maxFreq > 0) {
    freqDisplay = frequency / maxFreq;
  }
  // TODO: Display the sampling frequency on the UI
  // set the sampling frequency
const samplingFrequency = 1000; // 1000 Hz

// update the sampling frequency UI element
const frequencyElement = document.getElementById('sampling-frequency');
frequencyElement.innerHTML = `Sampling Frequency: ${samplingFrequency} Hz`;

}

// Define a function to update the recovered signal graph
function updateRecoveredSignalGraph(signal) {
  // TODO: Implement code to update the recovered signal graph using a library like Chart.js or D3.js
  // create a new Chart object
const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // x-axis labels
      datasets: [{
        label: 'Recovered Signal',
        data: [], // initial recovered signal data
        borderColor: 'green',
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (s)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Amplitude'
          }
        }]
      }
    }
  });
  
  // update the chart with new recovered signal data
  function updateChart(recoveredSignalData) {
    // update the dataset's data property with the new recovered signal data
    chart.data.datasets[0].data = recoveredSignalData;
  
    // update the x-axis labels with the appropriate time values
    const labels = [];
    for (let i = 0; i < recoveredSignalData.length; i++) {
      labels.push(i); // assume each data point represents 1 second
    }
    chart.data.labels = labels;
  
    // re-render the chart with the new data
    chart.update();
  }
  
}

// Define a function to update the difference graph
function updateDifferenceGraph(originalSignal, recoveredSignal) {
    // TODO:  Implement code to update the difference graph using a library like Chart.js or D3.js
    // create a new Chart object
const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // x-axis labels
      datasets: [{
        label: 'Difference',
        data: [], // initial difference data
        borderColor: 'red',
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (s)'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Amplitude'
          }
        }]
      }
    }
  });
  
  // update the chart with new difference data
  function updateChart(differenceData) {
    // update the dataset's data property with the new difference data
    chart.data.datasets[0].data = differenceData;
  
    // update the x-axis labels with the appropriate time values
    const labels = [];
    for (let i = 0; i < differenceData.length; i++) {
      labels.push(i); // assume each data point represents 1 second
    }
    chart.data.labels = labels;
  
    // re-render the chart with the new data
    chart.update();
  }
  
}

// Define a function to sample the signal at the given frequency
  // TODO: Implement code to sample the signal at the given frequency using the Whittaker–Shannon interpolation formula
function interpolateSignal(originalSignal, samplingFrequency) {
    const originalSignalLength = originalSignal.length;
    const tMax = originalSignalLength / samplingFrequency;
  
    // create an array to store the interpolated signal
    const interpolatedSignal = [];
  
    // iterate over the time interval from 0 to tMax
    for (let t = 0; t < tMax; t += 1 / samplingFrequency) {
      let sampleSum = 0;
  
      // iterate over the original signal samples
      for (let n = 0; n < originalSignalLength; n++) {
        const sinc = Math.sin(Math.PI * (t - n / samplingFrequency)) / (Math.PI * (t - n / samplingFrequency));
  
        if (Number.isNaN(sinc)) {
          continue; // avoid NaN values due to division by zero
        }
  
        sampleSum += originalSignal[n] * sinc;
      }
  
      interpolatedSignal.push(sampleSum);
    }
  
  
  // Return the sampled points
  return sampledPoints;
}

// Define a function to recover the original signal from the sampled points
function interpolate(sampledPoints) {
  // TODO: Implement code to recover the original signal from the sampled points using the Whittaker–Shannon interpolation formula
    const recoveredSignal = interpolateSignal(sampledPoints, samplingFrequency);
  // Return the recovered signal
  return recoveredSignal;
}

// Load signal from file or generate it programmatically
let signal = [1, 0, -1, 0, 1, 0, -1, 0, 1, 0]; // Example signal

// Mixer for composing signals
class SignalMixer {
  constructor() {
    this.components = [];
  }
  
  // Add a sinusoidal component to the mixer
  addComponent(freq, mag) {
    this.components.push({
      freq: freq,
      mag: mag
    });
  }
  
  // Remove a sinusoidal component from the mixer
  removeComponent(index) {
    this.components.splice(index, 1);
  }
  
  // Compose the mixed signal from the components
  compose() {
    let mixedSignal = new Array(signal.length).fill(0);
    for (let i = 0; i < this.components.length; i++) {
      let component = this.components[i];
      let freq = component.freq;
      let mag = component.mag;
      for (let j = 0; j < signal.length; j++) {
        mixedSignal[j] += mag * Math.sin(freq * j);
      }
    }
    return mixedSignal;
  }
}

// Example usage
let mixer = new SignalMixer();
mixer.addComponent(1, 0.5); // Add a 1 Hz sinusoidal component with magnitude 0.5
mixer.addComponent(2, 0.3); // Add a 2 Hz sinusoidal component with magnitude 0.3
let mixedSignal = mixer.compose(); // Compose the mixed signal
console.log(mixedSignal); // Output the mixed signal to the console


// create audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// load audio file
const audioFileInput = document.getElementById("audio-file-input");
audioFileInput.addEventListener("change", function() {
  const file = audioFileInput.files[0];
  const fileReader = new FileReader();
  fileReader.onload = function() {
    audioCtx.decodeAudioData(fileReader.result, function(buffer) {
      // play audio buffer
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    });
  };
  fileReader.readAsArrayBuffer(file);
});

// create signal mixer
const signalMixer = audioCtx.createGain();

// create frequency and magnitude inputs
const frequencyInput = document.getElementById("frequency-input");
const magnitudeInput = document.getElementById("magnitude-input");

// add sinusoidal signals to mixer
const addSignalButton = document.getElementById("add-signal-button");
addSignalButton.addEventListener("click", function() {
  const frequency = Number(frequencyInput.value);
  const magnitude = Number(magnitudeInput.value);
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  oscillator.connect(signalMixer);
  oscillator.start(0);
  oscillator.stop(audioCtx.currentTime + 2); // stop oscillator after 2 seconds
});

// remove signal from mixer
const removeSignalButton = document.getElementById("remove-signal-button");
removeSignalButton.addEventListener("click", function() {
  const oscillators = signalMixer.context.getRealtimeInfo().activeOscillators;
  if (oscillators.length > 0) {
    const oscillator = oscillators[oscillators.length - 1];
    oscillator.stop();
    oscillator.disconnect();
  }
});

// add noise to signal
const addNoiseButton = document.getElementById("add-noise-button");
addNoiseButton.addEventListener("click", function() {
  const snr = Number(document.getElementById("snr-input").value);
  const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) / Math.pow(10, snr / 20);
  }
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.connect(signalMixer);
  noiseSource.start(0);
});


// Define a canvas element in your HTML
<canvas id="myChart"></canvas>

// Get the canvas element
const canvas = document.getElementById('myChart').getContext('2d');

// Define some example data
const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const label = 'Signal';
const color = 'blue';

// Plot the line chart
plotLineChart(canvas, labels, data, label, color);