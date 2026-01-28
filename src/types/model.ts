export interface User {
	email: string
	role: string
	profile: {
		avatar: Blob
		phoneCode: String
		phone: String
		firstName: String
		LastName: String
	}
}
