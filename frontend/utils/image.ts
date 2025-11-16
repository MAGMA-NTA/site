export const getImageUrl = (path: string) => {
    if (!path) return ''
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path
    // Clean the path by removing any leading slashes and the base URL if present
    const cleanPath = path.replace(/^\/+/, '').replace('uploads/', '')
    return `/_ipx/f_webp,q_80/${cleanPath}`
}
