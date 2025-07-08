<script>
  import * as Lucide from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { LightSwitch } from "$lib/components/ui/light-switch";
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
        <Lucide.BellDot class="size-5" />
      </div>
      <span class="mr-4 mb-4">ping.</span>

      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <div class="flex h-9 items-center">
              <LightSwitch />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Switch theme</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>

    <div class="mt-4 grid w-full grid-cols-1 gap-4 text-sm">
      <div
        class="bg-muted/90 dark:bg-muted/10 flex items-center gap-3 rounded-lg p-3 transition-transform select-none hover:scale-102"
      >
        <Lucide.MessageCircle class="text-primary size-5" />
        <span>Simple public chat rooms</span>
      </div>
      <div
        class="bg-muted/90 dark:bg-muted/10 flex items-center gap-3 rounded-lg p-3 transition-transform select-none hover:scale-102"
      >
        <Lucide.Zap class="text-primary size-5" />
        <span>Refreshingly elegant and fast..!</span>
      </div>
    </div>

    <Button href="/room/list" class="mt-4 flex items-center gap-2 transition-all hover:scale-105">
      Explore rooms <Lucide.BowArrow class="size-4" />
    </Button>
  </div>
</div>
