var obj = {
  myFunc: function(a, b) {
    console.log(a, b)

    console.log(this === global)
    console.log(this === obj)
  }
}
obj.myFunc(); // false  true
(null, obj.myFunc)() // true
