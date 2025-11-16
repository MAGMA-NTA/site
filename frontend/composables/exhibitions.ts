export const useExhibitions = () => {
    const initExhibitions = () => {
        // Only run on client side
        if (typeof window === 'undefined') return
        
        const links = document.querySelectorAll('[data-name="exhibition_link"]')
        
        links.forEach((link) => {
            // Skip if already initialized
            if ((link as HTMLElement).dataset.initialized === 'true') {
                return
            }
            
            const cover = link.querySelector('[data-name="exhibition_cover"]') as HTMLElement
            if (!cover) return

            const handleMouseMove = (e: MouseEvent) => {
                const rect = link.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                cover.style.transform = `translate(${x}px, ${y}px)`
                cover.style.zIndex = '9999'
            }

            const handleMouseEnter = () => {
                cover.style.opacity = '1'
                link.addEventListener('mousemove', handleMouseMove)
            }

            const handleMouseLeave = () => {
                cover.style.opacity = '0'
                link.removeEventListener('mousemove', handleMouseMove)
            }

            link.addEventListener('mouseenter', handleMouseEnter)
            link.addEventListener('mouseleave', handleMouseLeave)
            
            // Mark as initialized
            ;(link as HTMLElement).dataset.initialized = 'true'
        })
    }

    return { initExhibitions }
}
