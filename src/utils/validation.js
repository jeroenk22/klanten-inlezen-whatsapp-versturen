export const validateMobileNumber = (number) => {
    if (!number) return false;
  
    const numberString = String(number).trim().replace(/\s+/g, ""); 
  
    const validFormats = [
      /^06\d{8}$/,        // 06xxxxxxxx
      /^00316\d{8}$/,     // 00316xxxxxxxx
      /^\+316\d{8}$/,     // +316xxxxxxxx
      /^\+31\s?6\d{8}$/   // +31 6xxxxxxxx (optionele spatie na +31)
    ];
  
    return validFormats.some((format) => format.test(numberString));
  };  