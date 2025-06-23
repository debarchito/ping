<script lang="ts">
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
</script>

<svelte:head>
  <title>Sign In | ping.</title>
</svelte:head>

<Card.Root class="md:min-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Sign In</Card.Title>
    <Card.Description>Enter your username to sign into your account</Card.Description>
  </Card.Header>

  <Card.Content>
    <div class="grid gap-4">
      <form class="grid gap-4" method="POST" action="?/sign-in" use:enhance>
        <div class="grid gap-2">
          <Label for="username">Username <span class="text-red-500">*</span></Label>
          <Input id="username" type="username" name="username" placeholder="janedoe" required />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password <span class="text-red-500">*</span></Label>
          </div>
          <div class="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="~!@#$%^"
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

        <Button type="submit" class="w-full">
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
        <a href="/sign-up" class="underline">Sign Up!</a>
      </div>
    </div>
  </Card.Content>
</Card.Root>
