function throttleArray(array=[], timeout=1000, index=1) {
  if (array.length >= index) {
      setTimeout(function() {
        console.log(array.slice(0, index).join(', '));
        throttleArray(array, timeout, index + 1);
      }, timeout);
  }
}

throttleArray(['aaa', 'bbb', 'xxx', 'ddd', 'zzz']);
