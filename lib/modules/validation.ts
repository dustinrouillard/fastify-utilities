export interface ValidationOptions {
  exact?: boolean;
  required?: string[];
  whitelisted?: string[];
}

export interface ValidationConstraints {
  email?: boolean;
  numbers?: boolean;
  length?: { min?: number; max?: number };
  nullable?: boolean;
  trim?: boolean;
  allowed?: (string | number)[];
  casing?: 'any' | 'upper' | 'lower';
  type?: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array';
}

// We only include the values that need to be true by default here
const DefaultConstraints: Partial<ValidationConstraints> = {
  nullable: true,
  trim: true,
  casing: 'any',
};

const EmailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export async function Validate(object: any, constraints: { [key: string]: ValidationConstraints }, options?: ValidationOptions) {
  if (typeof object != 'object') throw { error: 'not_an_object' };

  // Check if exact option is set and check if the string is set
  if (options?.exact && JSON.stringify(Object.keys(object).sort()) != JSON.stringify(Object.keys(constraints).sort())) throw { error: 'object_not_exact' };

  // Check if required option is set and check if the object contains those values
  if (options?.required && !options?.required.every((key) => Object.keys(object).includes(key))) throw { error: 'invalid_data_provided' };

  // Check if whitelisted option is set and check if the object contains anything that is not those values
  if (options?.whitelisted && !Object.keys(object).every((key) => options?.whitelisted?.includes(key))) throw { error: 'invalid_data_provided' };

  let validationErrors: Array<{ field?: string; error: string }> = [];

  // Iterate over the constrants and check the config for each item
  for await (let configItem of Object.keys(constraints)) {
    // Check if we have constrants for the key
    let config = { ...DefaultConstraints, ...constraints[configItem] } || DefaultConstraints;

    if (config.trim && typeof object[configItem] == 'string') object[configItem] = object[configItem].trim();

    // Check if nullable option is set and check if the string is set
    if (!config.nullable && (typeof object[configItem] === 'undefined' || object[configItem] === '' || object[configItem] === null))
      validationErrors.push({ field: configItem, error: 'value_not_nullable' });

    // Check if numbers option is set and check if the string is a number
    if (config.numbers && isNaN(object[configItem])) validationErrors.push({ field: configItem, error: 'not_a_number' });

    // Check if type option and then compare the typeof
    if (config.type && config.type == 'array' && object[configItem] && (typeof object[configItem] != 'object' || object[configItem].length == undefined))
      validationErrors.push({ field: configItem, error: 'incorrect_type' });
    if (config.type && config.type != 'array' && object[configItem] && typeof object[configItem] != config.type) validationErrors.push({ field: configItem, error: 'incorrect_type' });

    // Check if there is a length config first then check the min length and make sure the string is atleast that long
    if (config.length && config.length.min && object[configItem] && object[configItem].length < config.length.min) validationErrors.push({ field: configItem, error: 'does_not_meet_minimum_length' });

    // Check if there is a length config first then check the min length and make sure the string is atleast that long
    if (config.length && config.length.max && object[configItem] && object[configItem].length > config.length.max) validationErrors.push({ field: configItem, error: 'exceeds_maximum_length' });

    // Check if email option is set and check if the string is a valid email
    if (config.email && !object[configItem].match(EmailRegex)) validationErrors.push({ field: configItem, error: 'not_an_email' });

    // Check if allowed option is set and make sure it is one of the allowed items
    if (config.allowed && !config.allowed.includes(config.casing == 'lower' ? object[configItem].toLowerCase() : config.casing == 'upper' ? object[configItem].toUpperCase() : object[configItem]))
      validationErrors.push({ field: configItem, error: 'not_allowed_value' });

    // Check if casing option is set make sure the value matches the provided case
    if (config.casing && config.casing == 'lower' ? object[configItem].toLowerCase() : config.casing == 'upper' ? object[configItem].toUpperCase() : object[configItem] != object[configItem])
      validationErrors.push({ field: configItem, error: 'casing_does_not_match' });
  }

  if (validationErrors.length <= 0) return true;
  throw validationErrors;
}
