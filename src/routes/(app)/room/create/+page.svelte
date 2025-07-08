<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  let { form } = $props();
  let description = $state("");
  let descriptionLength = $derived(description.length);
  let descriptionMaxLength = $state(200);
</script>

<svelte:head>
  <title>Create a new Room | ping.</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="w-full max-w-sm">
    <a
      href="/"
      class="font-ms-madi flex items-center justify-center gap-2 text-6xl font-medium select-none"
    >
      <div
        class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105"
      >
        <Lucide.BellDot class="size-5" />
      </div>
      <span class="mr-4 mb-4">ping.</span>
    </a>

    <Card.Root class="mt-6">
      <Card.Header class="text-center">
        <Card.Title class="text-2xl">A new room, a new story</Card.Title>
        <Card.Description>What should we call this new room?</Card.Description>
      </Card.Header>

      <Card.Content class="grid gap-6">
        <Alert.Root variant="destructive">
          <Lucide.CircleAlert />
          <Alert.Title>Rooms are public and unencrypted!</Alert.Title>
          <Alert.Description>Do not share any sensitive information</Alert.Description>
        </Alert.Root>

        <form method="POST" use:enhance class="grid gap-4">
          <div class="grid gap-2">
            <Label for="roomname">Name</Label>
            <Input id="roomname" name="name" placeholder="cats" spellcheck="false" required />
          </div>

          <div class="grid gap-2">
            <Label for="display-name">Display name <Badge>optional</Badge></Label>
            <Input
              id="display-name"
              name="displayName"
              placeholder="The Cat Haven"
              spellcheck="false"
            />
          </div>

          <div class="grid gap-2">
            <Label for="room-description">Description <Badge>optional</Badge></Label>
            <Textarea
              id="room-description"
              bind:value={description}
              name="description"
              placeholder="Everything about cats..!"
              maxlength={descriptionMaxLength}
              spellcheck="false"
              class="max-h-50"
            />
            <span class="ml-auto text-right text-sm">
              {descriptionLength} / {descriptionMaxLength}
            </span>
          </div>

          <Button type="submit" class="w-full transition-all hover:scale-105">
            <Lucide.Plus />
            Create Room
          </Button>
        </form>

        {#if form?.message}
          <Alert.Root variant="destructive">
            <Lucide.TriangleAlert />
            <Alert.Description class="max-w-70">{form.message}</Alert.Description>
          </Alert.Root>
        {/if}

        <div class="text-center text-sm">
          Feeling adventurous? <a href="/room/list" class="underline">Explore rooms</a>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
