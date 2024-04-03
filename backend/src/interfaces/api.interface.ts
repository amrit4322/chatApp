
interface ApiResponse {
    status: number
    message: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any> // You can use Record<string, any> as a flexible type for data
}

interface ApiError {
    message: string;
    error?: object;
}

interface JwtPayload {
    // Define the properties you want in your JWT payload
    id: string | undefined
    email: string
    phoneNumber: string | undefined
    // Add other properties as needed
}


export { ApiResponse, ApiError, JwtPayload }