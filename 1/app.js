function throttleArray(array=[], timeout=1000) {
  outputArray(array, timeout);
}

function outputArray(array, timeout, index=1) {
  if (array.length >= index) {
      setTimeout(function() {
        console.log(array.slice(0, index).join(', '));
        outputArray(array, timeout, index + 1);
      }, timeout);
  }
}

var inputArray = ['aaa', 'bbb', 'xxx', 'ddd', 'zzz'];

throttleArray(inputArray);
