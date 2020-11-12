/*
 * Copyright ish group pty ltd 2020.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 */
package ish.security;

import ish.util.SecurityUtil;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.regex.Pattern;

/**
 * Wrapper on {@link PasswordUtil} for easy method access and default exception handling.
 */
public class AuthenticationUtil {

	private static final Pattern HASH_PATTERN = Pattern.compile("[a-zA-Z0-9]+:\\d+:[0-9a-f]+:[0-9a-f]+");

	/**
	 * Computes hash for password and compares it with stored one using old password hashing approach.
	 */
	public static boolean checkOldPassword(String password, String hash) {
		try {
			return SecurityUtil.hashPassword(password).equals(hash);
		} catch (UnsupportedEncodingException e) {
			return false;
		}
	}

	/**
	 * Cheks if password hash is in valid format.
	 */
	public static boolean isValidPasswordHash(String hash) {
		return HASH_PATTERN.matcher(hash).matches();
	}

	/**
	 * Computes password hash and checks if it matches stored value.
	 */
	public static boolean checkPassword(String password, String hash) {
		try {
			return PasswordUtil.validatePassword(password, hash);
		} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
			throw new RuntimeException("Password cannot be verified.", e);
		}
	}

	/**
	 * Generates hash string for specified password.
	 */
	public static String generatePasswordHash(String password) {
		try {
			return PasswordUtil.computeHash(password);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("Cannot compute hash.", e);
		} catch (InvalidKeySpecException e) {
			throw new RuntimeException("Cannot compute hash,", e);
		}
	}
}
