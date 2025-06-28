<script lang="ts">
  import type { PageProps } from "./$types";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { AlertCircle } from "@lucide/svelte";

  let { data }: PageProps = $props();
</script>

{#if data.status !== 200}
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardContent class="pt-6">
        <div class="flex flex-col items-center space-y-4 text-center">
          <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div class="space-y-3">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span class="text-red-600 dark:text-red-400">{data.status}:</span>
              {data.message}
            </h2>
            <p class="mt-5 space-y-2 text-sm">
              Continue <a href="/rooms" class="underline">exploring rooms</a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
{/if}
