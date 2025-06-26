<script>
  import { BellDot, WandSparkles, Zap, MessageCircle, Sun, Moon } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { toggleMode, mode } from "mode-watcher";
</script>

<svelte:head>
  <title>Welcome to ping.</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col items-center gap-6 text-center">
    <div class="font-ms-madi flex items-center gap-2 self-center text-6xl font-medium select-none">
      <div
        class="bg-primary text-primary-foreground flex size-8 transform items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105"
      >
        <BellDot class="size-5" />
      </div>
      <span class="mr-4 mb-4">ping.</span>

      <button
        on:click={toggleMode}
        class="hover:bg-muted mr-4 flex size-10 items-center justify-center rounded-full border transition-colors"
        aria-label="Toggle theme"
      >
        {#if mode.current === "dark"}
          <Sun class="size-5" />
        {:else}
          <Moon class="size-5" />
        {/if}
      </button>
    </div>

    <div class="mt-4 grid w-full grid-cols-1 gap-4 text-sm">
      <div
        class="bg-muted/90 dark:bg-muted/10 flex items-center gap-3 rounded-lg p-3 transition-transform select-none hover:scale-102"
      >
        <MessageCircle class="text-primary size-5" />
        <span>Simple public chat rooms</span>
      </div>
      <div
        class="bg-muted/90 dark:bg-muted/10 flex items-center gap-3 rounded-lg p-3 transition-transform select-none hover:scale-102"
      >
        <Zap class="text-primary size-5" />
        <span>Refreshingly simple and fast..!</span>
      </div>
    </div>

    <Button href="/sign-in" class="mt-4 flex items-center gap-2">
      Try <WandSparkles class="size-4" />
    </Button>
  </div>
</div>
