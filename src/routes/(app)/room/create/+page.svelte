<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { BadgePlus, TriangleAlert, CircleAlert, BellDot } from "@lucide/svelte";
  import * as Alert from "$lib/components/ui/alert/index.js";

  let { form }: { form: ActionData } = $props();
  let description = $state("");
  let descriptionLength = $derived(description.length);
  let descriptionMaxLength = $state(200);
</script>

<svelte:head>
  <title>Create a new Room | ping.</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <a
      href="/"
      class="font-ms-madi flex items-center gap-2 self-center text-6xl font-medium select-none"
    >
      <div
        class="bg-primary text-primary-foreground flex size-8 transform items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105"
      >
        <BellDot class="size-5" />
      </div>
      <span class="mr-4 mb-4">ping.</span>
    </a>

    <div class="flex flex-col gap-6">
      <Card.Root class="md:min-w-sm">
        <Card.Header class="text-center">
          <Card.Title class="text-2xl">A new room, a new story</Card.Title>
          <Card.Description>What should we call this new room?</Card.Description>
        </Card.Header>

        <Card.Content>
          <div class="grid gap-4">
            <Alert.Root variant="destructive" class="mb-6">
              <CircleAlert />
              <Alert.Title>Rooms are public and unencrypted!</Alert.Title>
              <Alert.Description>Do not share any sensitive information</Alert.Description>
            </Alert.Root>
          </div>

          <div class="grid gap-4">
            <form class="grid gap-4" method="POST" action="?/create-room" use:enhance>
              <div class="grid gap-2">
                <Label for="roomname">Name</Label>
                <Input
                  id="roomname"
                  type="roomname"
                  name="roomname"
                  placeholder="kitty"
                  spellcheck="false"
                  required
                />
              </div>

              <div class="grid gap-2">
                <Label for="room-description">Description</Label>
                <Textarea
                  id="room-description"
                  bind:value={description}
                  name="room-description"
                  placeholder="Everything about cats..!"
                  class="max-h-50"
                  maxlength={descriptionMaxLength}
                  spellcheck="false"
                  required
                />
                <span class="ml-auto text-right text-sm"
                  >{descriptionLength} / {descriptionMaxLength}</span
                >
              </div>

              <Button type="submit" class="w-full transition-all hover:scale-105">
                <BadgePlus />
                Create Room
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
              Feeling adventurous?
              <a href="/room/list" class="underline">Explore rooms</a>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
