<script>
  import { BellDot } from "@lucide/svelte";
  const { children } = $props();
</script>

<div class="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <a
      href="/"
      class="font-ms-madi flex items-center gap-2 self-center text-6xl font-medium select-none"
      aria-label="Go to homepage"
    >
      <div
        class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105"
      >
        <BellDot class="size-5" />
      </div>
      <span class="mr-4 mb-4">ping.</span>
    </a>

    {@render children()}
  </div>
</div>
