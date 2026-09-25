export function countAppliedFilters(
  formData,
  defaultFormData,
  { exclude = ['q'] } = {}
) {
  const excludedFields = new Set(['q', ...exclude]);

  return Object.keys(defaultFormData).filter(field => {
    if (excludedFields.has(field)) {
      return false;
    }

    return formData[field] !== defaultFormData[field];
  }).length;
}
