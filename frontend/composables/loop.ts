export const loop = (element: string) => {
    if (typeof window === 'undefined') return

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        addLoop()
    }

    function addLoop() {
        const scrollers = document.querySelectorAll(element)

        if (!scrollers.length) return

        scrollers.forEach((scroller) => {
            const children = Array.from(scroller.children)

            children.forEach((child) => {
                const clone = child.cloneNode(true) as Element
                clone.setAttribute('aria-hidden', 'true')
                scroller.appendChild(clone)

                child.addEventListener('mouseenter', () => {
                    scroller.style.animationPlayState = 'paused'
                })

                child.addEventListener('mouseleave', () => {
                    scroller.style.animationPlayState = 'running'
                })

                clone.addEventListener('mouseenter', () => {
                    scroller.style.animationPlayState = 'paused'
                })

                clone.addEventListener('mouseleave', () => {
                    scroller.style.animationPlayState = 'running'
                })
            })
        })
    }
}
