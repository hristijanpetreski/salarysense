import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
    return (
        <main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
            <Title>Page not found - SalarySense</Title>
            <HttpStatusCode code={404} />
            <article
                class="w-full max-w-4xl transform rounded-2xl p-8 shadow-1 bg-surface-container text-on-surface"
                aria-labelledby="notfound-heading"
            >
                <div class="flex flex-col-reverse items-center gap-8 sm:flex-row sm:items-start">
                    <section class="w-full sm:w-2/3">
                        <p class="inline-flex items-center rounded-full bg-error-container px-3 py-1 text-sm font-semibold text-on-error-container">
                            <span class="text-sm font-bold tracking-wide">
                                404
                            </span>
                        </p>

                        <h1
                            id="notfound-heading"
                            class="mt-6 text-3xl font-bold leading-tight text-on-surface sm:text-5xl"
                        >
                            Page not found
                        </h1>

                        <p class="mt-4 text-base text-on-surface-variant">
                            It looks like the page you were trying to reach
                            doesn't exist or has been moved.
                        </p>

                        <div class="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="/"
                                class="inline-flex items-center justify-center rounded-lg bg-primary text-on-primary px-5 py-2.5 text-sm font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                                aria-label="Go back home"
                            >
                                Go back home
                            </a>
                        </div>

                        <p class="mt-6 text-sm text-on-surface-variant">
                            If you arrived here from a saved link, it may be out
                            of date.
                        </p>
                    </section>
                </div>
            </article>
        </main>
    );
}
