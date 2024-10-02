// stores/useFormStore.js
import {defineStore} from 'pinia';
import {computed, reactive} from 'vue';

type CheckoutFormData = {
  firstName: string,
  lastName: string,
  email: string,
  street: string,
  city: string,
  postalCode: string,
};

export const useFormStore = defineStore('form', () => {
  // Form data
  const formData: CheckoutFormData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const gdpr = ref(false);
  const submitted = ref(false);

  const $reset = () => {
    submitted.value = false;
    gdpr.value = false;
    formData.firstName = '';
    formData.lastName = '';
    formData.email = '';
    formData.street = '';
    formData.city = '';
    formData.postalCode = '';
  };

  // Validation rules: form should not be empty and email should be valid
  const isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(formData.email);
  });

  // Computed property to check if a field is empty
  const isFieldInvalid = computed(() => {
    return {
      firstName: formData.firstName.trim() === '' && submitted.value,
      lastName: formData.lastName.trim() === '' && submitted.value,
      email: formData.email.trim() === '' && submitted.value,
      street: formData.street.trim() === '' && submitted.value,
      city: formData.city.trim() === '' && submitted.value,
      postalCode: formData.postalCode.trim() === '' && submitted.value,
    };
  });

  // Computed property to check if the form is empty
  const isFormEmpty = computed(() => {
    return !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim() ||
        !formData.street.trim() ||
        !formData.city.trim() ||
        !formData.postalCode.trim();
  });

  // Computed property to check if the form is valid
  const isFormValid = computed(() => {
    return !isFormEmpty.value && isValidEmail.value;
  });

  // Action to update form fields
  const updateFormField = (field: keyof CheckoutFormData, value: string) => {
    formData[field] = value;
  };

  // Action to submit form (can add your API call here)
  const submitForm = () => {
    submitted.value = true;
    if (!isFormValid.value) {
      alert('Bitte alle Felder ausfüllen und auf gültige Email-Adresse prüfen!');
      return;
    }
    if (!gdpr.value) {
      alert('Bitte Datenschutzerklärung akzeptieren!');
      return;
      // You can clear the form or handle the success case here
    }
  };

  return {
    formData,
    gdpr,
    submitted,
    isFieldInvalid,
    isFormEmpty,
    isFormValid,
    updateFormField,
    submitForm,
    isValidEmail,
    $reset,
  };
});
