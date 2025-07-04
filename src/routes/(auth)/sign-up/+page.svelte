<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Check, TriangleAlert, Eye, EyeClosed } from "@lucide/svelte";

  let { form }: { form: ActionData } = $props();
  let url = new URL(page.url);
  let password = $state("");
  let showPassword = $state(false);
  let repeatPassword = $state("");
  let showRepeatPassword = $state(false);
  let passwordMismatch = $derived(
    password.length > 0 && repeatPassword.length > 0 && password !== repeatPassword,
  );
</script>

<svelte:head>
  <title>Sign up | ping.</title>
</svelte:head>

<div class="flex flex-col gap-6">
  <Card.Root class="md:min-w-sm">
    <Card.Header class="text-center">
      <Card.Title class="text-2xl">Let's get you there</Card.Title>
      <Card.Description>Sign up using an email and username</Card.Description>
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
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="janedoe"
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
                bind:value={password}
                type={showPassword ? "text" : "password"}
                name="password"
                class={passwordMismatch ? "border-red-500" : ""}
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

          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="repeat-password">Repeat password</Label>
            </div>
            <div class="relative">
              <Input
                id="repeat-password"
                bind:value={repeatPassword}
                type={showRepeatPassword ? "text" : "password"}
                class={passwordMismatch ? "border-red-500" : ""}
                spellcheck="false"
                required
              />
              <button
                type="button"
                class="absolute top-1/2 right-2 -translate-y-1/2"
                onclick={() => (showRepeatPassword = !showRepeatPassword)}
              >
                {#if showRepeatPassword}
                  <EyeClosed />
                {:else}
                  <Eye />
                {/if}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            class="w-full transition-all hover:scale-105"
            disabled={passwordMismatch}
          >
            <Check />
            Sign Up
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
          Already have an account?
          <a href={`/sign-in${url.search}`} class="underline">Sign in</a>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
