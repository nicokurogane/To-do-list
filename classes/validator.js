class Validator {
  static isStringEmpty(stringToCheck) {
    return stringToCheck === "";
  }

  static isStringAboveLengthLimit(length, stringToCheck) {
    return stringToCheck.length > length;
  }

  static isOnlyOneCheckBoxSelected(checkboxes) {
    let numberOfChecked = 0;
    checkboxes.forEach(checkbox => {
      numberOfChecked += checkbox.checked ? 1 : 0;
    });
    return numberOfChecked !== 1;
  }
}
