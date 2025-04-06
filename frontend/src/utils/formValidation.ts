/**
 * Form validation utility functions
 */

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email) {
    return { isValid: false, error: "Email is required" };
  } else if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true, error: "" };
};

// Username validation
export const validateUsername = (username: string): { isValid: boolean; error: string } => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  
  if (!username) {
    return { isValid: false, error: "Username is required" };
  } else if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      error: "Username must be 3-20 characters and can only contain letters, numbers, underscores and hyphens" 
    };
  }
  
  return { isValid: true, error: "" };
};

// Password validation for registration
export const validatePassword = (password: string): { isValid: boolean; error: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  } else if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  } else if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter" };
  } else if (!/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter" };
  } else if (!/[0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one number" };
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one special character" };
  }
  
  return { isValid: true, error: "" };
};

// URL validation
export const validateUrl = (url: string): { isValid: boolean; error: string } => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  
  if (!url) {
    return { isValid: true, error: "" }; // URLs can be optional
  } else if (!urlRegex.test(url)) {
    return { isValid: false, error: "Please enter a valid URL" };
  }
  
  return { isValid: true, error: "" };
};

// File size validation
export const validateFileSize = (file: File, maxSizeMB: number): { isValid: boolean; error: string } => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }
  
  return { isValid: true, error: "" };
};

// File type validation
export const validateFileType = (
  file: File, 
  allowedTypes: string[]
): { isValid: boolean; error: string } => {
  const fileType = file.type.split('/')[1];
  
  if (!allowedTypes.includes(fileType)) {
    return { 
      isValid: false, 
      error: `File must be one of the following types: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true, error: "" };
};

// Text length validation
export const validateTextLength = (
  text: string, 
  options: { min?: number; max?: number; name: string }
): { isValid: boolean; error: string } => {
  const { min, max, name } = options;
  
  if (min && text.length < min) {
    return { 
      isValid: false, 
      error: `${name} must be at least ${min} characters long` 
    };
  }
  
  if (max && text.length > max) {
    return { 
      isValid: false, 
      error: `${name} must be no more than ${max} characters long` 
    };
  }
  
  return { isValid: true, error: "" };
};

// Name validation
export const validateName = (name: string): { isValid: boolean; error: string } => {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  } else if (name.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }
  
  return { isValid: true, error: "" };
};

// Check if passwords match
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  } else if (confirmPassword !== password) {
    return { isValid: false, error: "Passwords do not match" };
  }
  
  return { isValid: true, error: "" };
};

// Simplified password validation for login
export const validateLoginPassword = (password: string): { isValid: boolean; error: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  
  return { isValid: true, error: "" };
};

// Project title validation
export const validateProjectTitle = (title: string): { isValid: boolean; error: string } => {
  if (!title) {
    return { isValid: false, error: "Project title is required" };
  } else if (title.length < 3) {
    return { isValid: false, error: "Project title must be at least 3 characters" };
  } else if (title.length > 100) {
    return { isValid: false, error: "Project title must be less than 100 characters" };
  }
  
  return { isValid: true, error: "" };
};

// Project description validation
export const validateProjectDescription = (description: string): { isValid: boolean; error: string } => {
  if (!description) {
    return { isValid: false, error: "Project description is required" };
  } else if (description.length < 10) {
    return { isValid: false, error: "Project description must be at least 10 characters" };
  } else if (description.length > 2000) {
    return { isValid: false, error: "Project description must be less than 2000 characters" };
  }
  
  return { isValid: true, error: "" };
};

// Comment validation
export const validateComment = (comment: string): { isValid: boolean; error: string } => {
  if (!comment) {
    return { isValid: false, error: "Comment cannot be empty" };
  } else if (comment.length < 2) {
    return { isValid: false, error: "Comment must be at least 2 characters" };
  } else if (comment.length > 1000) {
    return { isValid: false, error: "Comment must be less than 1000 characters" };
  }
  
  return { isValid: true, error: "" };
};

// Helper to create validation state hooks
export function createValidationState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string>("");
  
  return {
    value,
    setValue,
    error,
    setError,
    reset: () => {
      setValue(initialValue);
      setError("");
    }
  };
}

// Helper to create common validation style classes
export const getInputErrorClass = (hasError: boolean, isValid: boolean = false): string => {
  if (hasError) return "ring-red-500";
  if (isValid) return "ring-green-500";
  return "ring-gray-700";
};

// Form field component to simplify validation across forms
export const getFieldClassName = (hasError: boolean): string => {
  return `w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
    hasError ? "ring-red-500" : "ring-gray-700"
  }`;
};
