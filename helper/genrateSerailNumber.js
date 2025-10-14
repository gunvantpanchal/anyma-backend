 function generateSerialNumber(code) {
  const serialNo=   Math.floor(Math.pow(10, 6-1) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 6-1))).toString();
    const currentYear = new Date().getFullYear();
    return `${code}${currentYear}${serialNo}` 
}
module.exports=generateSerialNumber;