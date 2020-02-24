export type ContextArgs = Readonly<{
	owner: string;
	repo: string;
	tagName: string;
	branch: string;
}>;

export type Config = Readonly<{
	owner: string;
	repo: string;
	inputs?: {
		PACKAGE_MANAGER?: string;
		BUILD_COMMAND?: string;
		COMMIT_MESSAGE?: string;
		COMMIT_NAME?: string;
		COMMIT_EMAIL?: string;
		BRANCH_NAME?: string;
		CLEAN_TARGETS?: string;
		BUILD_COMMAND_TARGET?: string;
		CREATE_MAJOR_VERSION_TAG?: string;
		CREATE_MINOR_VERSION_TAG?: string;
		CREATE_PATCH_VERSION_TAG?: string;
		OUTPUT_BUILD_INFO_FILENAME?: string;
		FETCH_DEPTH?: string;
		TEST_TAG_PREFIX?: string;
		CLEAN_TEST_TAG?: string;
		ORIGINAL_TAG_PREFIX?: string;
		[key: string]: string | undefined;
	};
}>;
