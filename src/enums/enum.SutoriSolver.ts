enum SutoriSolver {
	/** use this when no solver is required */
	None = 'none',

	/** use this when an option should be selected based on the index position of the option chosen */
	OptionIndex = 'option_index',

	/** use this when an option should be selected based on a selected keyboard character */
	KeyCharEquality = 'key_char_equality',

	/** use this when an option should be selected when text matches */
	TextEquality = 'text_equality',

	/** use this if the custom callback should be used to determine when an option should be selected */
	Custom = 'custom'
}