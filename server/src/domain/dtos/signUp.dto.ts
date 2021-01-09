import {
	IsDefined,
	IsEmail,
	IsPhoneNumber,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { IsSwissMobileNumber } from './validators/phone.validator';

/**
 * Checks if the string contains atleast one lowercase char (a-z)
 */
const lowercaseCharRegexp = /[a-z]{1,}/;

/**
 * Checks if the string contains atleast one uppercase char (A-Z)
 */
const upppercaseCharRegexp = /[A-Z]{1,}/;

/**
 * Checks if the string contains atleast one digit (0-9)
 */
const digitRegexp = /\d{1,}/;

/**
 * Checks if the string contains atleast one special char (~!@#$%^&*_-+=`|\(){}[]:;"'<>,.?/)
 */
const specialCharRegexp = /[~!@#$%^&*_\-+=`\-|\\(){}\[\]:;"'<>,.?/]{1,}/;

/**
 * Dto for signing up a new user
 */
export class SignUpDto {
	/**
	 * Username of the new user
	 */
	@IsDefined({
		message: 'The username cannot be emtpy or missing',
	})
	@IsString({
		message: 'The email must be a string value',
	})
	@MinLength(3, {
		message: 'The username must be atleast 3 characters long',
	})
	@MaxLength(15, {
		message: 'The username cannot be longer than 15 characters',
	})
	username: string;

	/**
	 * EMail address of the new user
	 */
	@IsDefined({
		message: 'The email cannot be emtpy or missing',
	})
	@IsString({
		message: 'The email must be a string value',
	})
	@IsEmail(undefined, {
		message: 'The email must be an valid email address',
	})
	email: string;

	/**
	 * Phone number of the new user
	 */
	@IsDefined({
		message: 'The phone number cannot be emtpy or missing',
	})
	@IsString({
		message: 'The phone number must be a string value',
	})
	@IsPhoneNumber('CH', {
		message: 'The phone number must be a valid swiss phone number',
	})
	@IsSwissMobileNumber()
	phone: string;

	/**
	 * Plain text password of the new user
	 */
	@IsDefined({
		message: 'The password cannot be emtpy or missing',
	})
	@IsString({
		message: 'The password must be a string value',
	})
	@MinLength(10, {
		message: 'The password must be atleast 10 characters long',
	})
	@Matches(lowercaseCharRegexp, {
		message:
			'The password must contain atleast one lowercase character (a-z)',
	})
	@Matches(upppercaseCharRegexp, {
		message:
			'The password must contain atleast one uppercase character (A-Z)',
	})
	@Matches(digitRegexp, {
		message: 'The password must contain atleast one digit (0-9)',
	})
	@Matches(specialCharRegexp, {
		message: 'The password must contain atleast one special character',
	})
	password: string;
}
