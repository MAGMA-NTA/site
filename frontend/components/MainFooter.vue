<template>
    <div class="h-screen relative overflow-hidden">
        <div
            data-name="footer-background"
            class="w-full h-full absolute top-0 left-0 z-0">
            <img
                src="../assets/img/footerBg.svg"
                alt="footer background"
                class="w-full h-full object-cover" />
        </div>

        <h3
            class="text-[5rem] uppercase tracking-[0.5em] leading-[100%] relative mt-[5vw]">
            <span class="absolute top-0 left-0 text-blue">Bring</span>
            <span
                class="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[13vw] text-orange"
                >Your</span
            >
            <span class="absolute top-0 right-0 translate-y-[17vw] text-yellow"
                >Idea</span
            >
        </h3>
        <p
            class="text-body max-w-[320px] h-fit bottom-24 left-1/2 -translate-x-1/2 absolute text-white text-lg">
            If you wish to do your exhibition at MAGMA or if you are a tattoo
            artist...
            <a
                href="mailto:info@magma-nta.com"
                class="uppercase text-teaser tracking-[0.4em] mt-3 flex items-center gap-2 text-nav-sm">
                <svg
                    width="57"
                    height="27"
                    viewBox="0 0 57 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M56.7885 13.2794C56.7885 13.2794 44.076 26.5589 28.3943 26.5589C12.7125 26.5589 0 13.2794 0 13.2794C0 13.2794 12.7125 0 28.3943 0C44.076 0 56.7885 13.2794 56.7885 13.2794Z"
                        fill="#F9FFFE" />
                    <circle
                        cx="28.4591"
                        cy="13.2148"
                        r="10.019"
                        fill="#3E44B9" />
                </svg>
                <span>Talk to us!</span>
            </a>
        </p>
    </div>
</template>

<script lang="ts" setup>
function adjustFontSize() {
    const elements = document.querySelectorAll('.title-full')

    elements.forEach((element) => {
        element.style.setProperty(
            '--char-count',
            element.textContent?.length || '0'
        )
    })
}

onMounted(() => {
    adjustFontSize()
    window.addEventListener('resize', adjustFontSize)
})
</script>

<style></style>
