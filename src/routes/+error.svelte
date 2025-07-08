<script lang="ts">
  import { Card, CardContent } from "$lib/components/ui/card";
  import { AlertCircle } from "@lucide/svelte";
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} | ping.</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center p-4">
  <Card class="w-full max-w-md">
    <CardContent class="pt-6">
      <div class="flex flex-col items-center space-y-4 text-center">
        <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
          <AlertCircle class="size-10 text-red-600 dark:text-red-400" />
        </div>
        <div class="space-y-3">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            <span class="text-red-600 dark:text-red-400">{page.status}:</span>
            {page.error?.message}
          </h2>
          <p class="mt-5 text-sm">
            Continue <a href="/room/list" class="underline">exploring rooms</a>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
