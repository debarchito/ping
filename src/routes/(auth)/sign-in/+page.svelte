<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { LogIn, TriangleAlert, Eye, EyeClosed } from "@lucide/svelte";

  let { form }: { form: ActionData } = $props();
  let showPassword = $state(false);
  let url = new URL(page.url);
</script>

<svelte:head>
  <title>Sign in | ping.</title>
</svelte:head>

<div class="flex flex-col gap-6">
  <Card.Root class="md:min-w-sm">
    <Card.Header class="text-center">
      <Card.Title class="text-2xl">Welcome back</Card.Title>
      <Card.Description>Sign in with your email</Card.Description>
    </Card.Header>

    <Card.Content>
      <div class="grid gap-4">
        <form class="grid gap-4" method="POST" use:enhance>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="me@janedoe.com"
              spellcheck="false"
              required
            />
          </div>

          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <div class="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                spellcheck="false"
                required
              />
              <button
                type="button"
                class="absolute top-1/2 right-2 -translate-y-1/2"
                onclick={() => (showPassword = !showPassword)}
              >
                {#if showPassword}
                  <EyeClosed />
                {:else}
                  <Eye />
                {/if}
              </button>
            </div>
          </div>

          <Button type="submit" class="w-full transition-all hover:scale-105">
            <LogIn />
            Sign In
          </Button>
        </form>

        {#if form?.message}
          <Alert.Root variant="destructive">
            <TriangleAlert />
            <Alert.Description class="max-w-70">
              <span>{form?.message}</span>
            </Alert.Description>
          </Alert.Root>
        {/if}

        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href={`/sign-up${url.search}`} class="underline">Sign up</a>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
