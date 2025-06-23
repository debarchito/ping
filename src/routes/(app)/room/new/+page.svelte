<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { BadgePlus, CircleAlert } from "@lucide/svelte";
  import * as Alert from "$lib/components/ui/alert/index.js";

  let description = $state("");
  let descriptionLength = $derived(description.length);
  let descriptionMaxLength = $state(200);
</script>

<svelte:head>
  <title>Create a New Room | ping.</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center px-4">
  <Card.Root class="md:min-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Create a New Room</Card.Title>
      <Card.Description>Enter the details to create a room</Card.Description>
    </Card.Header>

    <Card.Content>
      <div class="grid gap-4">
        <Alert.Root class="mb-6">
          <CircleAlert />
          <Alert.Title>Rooms are public and unencrypted!</Alert.Title>
          <Alert.Description>Do not share any sensitive information</Alert.Description>
        </Alert.Root>
      </div>

      <div class="grid gap-4">
        <form class="grid gap-4" method="POST" action="?/create-room" use:enhance>
          <div class="grid gap-2">
            <Label for="roomname">What should we call it? <span class="text-red-500">*</span></Label
            >
            <Input
              id="roomname"
              type="roomname"
              name="roomname"
              placeholder="Jane Cooks!"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="room-description">
              What is this room about? <span class="text-red-500">*</span>
            </Label>
            <Textarea
              id="room-description"
              bind:value={description}
              name="room-description"
              placeholder="A room to share Jane's best recipes!"
              class="max-h-50"
              maxlength={descriptionMaxLength}
              required
            />
            <span class="ml-auto text-right text-sm"
              >{descriptionLength} / {descriptionMaxLength}</span
            >
          </div>

          <Button type="submit" class="w-full">
            <BadgePlus />
            Create Room
          </Button>
        </form>
      </div>
    </Card.Content>
  </Card.Root>
</div>
