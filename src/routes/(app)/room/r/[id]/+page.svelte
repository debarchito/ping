<script lang="ts">
  import type { PageProps } from "./$types";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import * as Chat from "$lib/components/ui/chat";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import * as EmojiPicker from "$lib/components/ui/emoji-picker";
  import * as Popover from "$lib/components/ui/popover";
  import { LightSwitch } from "$lib/components/ui/light-switch";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import {
    AlertCircle,
    MessageCircle,
    SmilePlusIcon,
    SendHorizontal,
    LogIn,
    LogOut,
    ArrowLeft,
  } from "@lucide/svelte";
  import { cn } from "$lib/utils";
  import { UseAutoScroll } from "$lib/hooks/use-auto-scroll.svelte";
  import { goto } from "$app/navigation";

  let { data }: PageProps = $props();
  let message = $state("");
  let emojiPickerOpen = $state(false);

  const autoScroll = new UseAutoScroll();

  function getInitials(name: string): string {
    return name ? name.substring(0, 1).toUpperCase() : "U";
  }

  function formatTime(date: Date | null | undefined): string {
    if (!date) return "";
    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  function handleSubmit() {
    if (message.trim() && data.payload?.user) {
      message = "";
      autoScroll.scrollToBottom();
    }
  }

  $effect(() => {
    if (data.status === 200 && data.payload?.messages.items.length) {
      autoScroll.scrollToBottom();
    }
  });
</script>

<svelte:head>
  {#if data.status != 200}
    <title>{data.status} | ping.</title>
  {:else}
    <title>{data.payload!.room.displayName || data.payload!.room.name} | ping.</title>
  {/if}
</svelte:head>

{#if data.status == 200}
  <div class="flex h-screen flex-col overflow-hidden">
    <div
      class="bg-background/95 supports-[backdrop-filter]:bg-background/60 z-10 border-b backdrop-blur"
    >
      <div class="mx-auto flex max-w-4xl items-center justify-between p-3 sm:p-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <div
            class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full sm:size-10"
          >
            <MessageCircle class="size-4 sm:size-5" />
          </div>
          <div>
            <h1
              class="max-w-[150px] truncate text-lg font-semibold sm:max-w-xs sm:text-xl md:max-w-md"
            >
              {data.payload!.room.displayName || data.payload!.room.name}
            </h1>
            <p class="text-muted-foreground text-xs">
              {data.payload?.room.description?.length > 30
                ? `${data.payload?.room.description?.substring(0, 30)}...`
                : data.payload?.room.description}
            </p>
            <Badge class="mt-2">
              <a href="/room/r/{data.payload!.room.id}">
                r/{data.payload!.room.id}
              </a>
            </Badge>
          </div>
        </div>
        <div class="flex items-center gap-1 sm:gap-2">
          {#if data.payload?.user}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <div
                    class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm"
                  >
                    {data.payload?.user.name[0].toUpperCase()}
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>Signed in as {data.payload?.user.email}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          {/if}

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button
                  onclick={() => goto("/room/list")}
                  variant="outline"
                  class="h-9 w-9 rounded-md shadow-sm transition-shadow hover:shadow-md"
                >
                  <ArrowLeft class="size-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Explore rooms</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <LightSwitch />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Switch theme</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>

          {#if data.payload?.user}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Button
                    onclick={() => goto("/sign-out")}
                    variant="outline"
                    class="h-9 w-9 rounded-md shadow-sm transition-shadow hover:shadow-md"
                  >
                    <LogOut class="size-4" />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>Sign out</p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          {/if}
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="relative mx-auto h-full w-full max-w-4xl overflow-y-auto">
        {#if !data.payload!.messages.items.length}
          <div
            class="flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12"
          >
            <div class="bg-muted mb-4 rounded-full p-3 sm:p-4">
              <MessageCircle class="text-muted-foreground size-6 sm:size-8" />
            </div>
            <h3 class="text-muted-foreground mb-2 text-base font-medium sm:text-lg">
              No messages yet
            </h3>
            <p class="text-muted-foreground max-w-md text-xs sm:text-sm">
              Be the first to start a conversation in this room!
            </p>
          </div>
        {:else}
          <div bind:this={autoScroll.ref} class="h-full overflow-y-auto px-1 sm:px-2">
            <Chat.List class="space-y-2 p-2 sm:space-y-3 sm:p-3 md:space-y-4 md:p-4">
              {#each [...data.payload!.messages.items].reverse() as msg (msg.id)}
                {@const isSentByMe = "userId" in msg && msg.userId === data.payload!.user?.id}
                <Chat.Bubble
                  variant={isSentByMe ? "sent" : "received"}
                  class="shadow-sm transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md"
                >
                  <Chat.BubbleAvatar>
                    <Chat.BubbleAvatarFallback
                      class={cn(
                        "ring-background/50 ring-1",
                        isSentByMe
                          ? "bg-primary/90 text-primary-foreground"
                          : "bg-secondary/90 text-secondary-foreground",
                      )}
                    >
                      {getInitials("name" in msg.user ? msg.user.name : "")}
                    </Chat.BubbleAvatarFallback>
                  </Chat.BubbleAvatar>
                  <Chat.BubbleMessage
                    class={cn(
                      "flex flex-col gap-1 rounded-2xl border px-3 py-2 shadow-sm sm:px-4 sm:py-2.5",
                      isSentByMe
                        ? "bg-primary/5 dark:bg-primary/8 border-primary/15 text-foreground"
                        : "bg-secondary/5 dark:bg-secondary/8 border-secondary/15 text-foreground",
                    )}
                  >
                    <p class="text-sm leading-relaxed break-words sm:text-base dark:text-white">
                      {msg.content ?? ""}
                    </p>
                    <div
                      class={cn(
                        "w-full text-xs italic opacity-60",
                        isSentByMe ? "text-end text-gray-200" : "text-foreground/70 text-start",
                      )}
                    >
                      {formatTime(msg.created ? new Date(msg.created) : null)}
                    </div>
                  </Chat.BubbleMessage>
                </Chat.Bubble>
              {/each}
            </Chat.List>
          </div>
        {/if}
      </div>
    </div>

    <div
      class="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t px-3 py-2 backdrop-blur sm:px-4 sm:py-3 md:py-4"
    >
      <div class="mx-auto max-w-4xl">
        {#if data.payload!.user}
          <form
            onsubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            class="flex place-items-center"
          >
            <div class="relative flex w-full items-center">
              <Input
                bind:value={message}
                class="h-10 rounded-full pr-16 pl-10 text-sm sm:h-11 sm:pr-24 sm:pl-12 sm:text-base md:h-12"
                placeholder="Type your message..."
              />

              <div class="absolute left-3 flex h-full items-center">
                <EmojiPicker.Root
                  showRecents
                  recentsKey="emoji-picker-recents"
                  disableInitialScroll
                  onSelect={(selected) => {
                    emojiPickerOpen = false;
                    message += selected.emoji;
                  }}
                >
                  <Popover.Root bind:open={emojiPickerOpen}>
                    <Popover.Trigger
                      class="text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                    >
                      <SmilePlusIcon class="size-4 sm:size-5" />
                    </Popover.Trigger>
                    <Popover.Content class="w-auto p-0" side="top" align="start">
                      <EmojiPicker.Search />
                      <EmojiPicker.List class="h-[175px]" />
                      <EmojiPicker.Footer
                        class="relative flex max-w-[232px] place-items-center gap-2 px-2"
                      >
                        {#snippet children({ active })}
                          <div class="flex w-[calc(100%-40px)] items-center gap-2">
                            <span class="text-lg">{active?.emoji}</span>
                            <span class="text-muted-foreground truncate text-xs">
                              {active?.data.name}
                            </span>
                          </div>
                          <EmojiPicker.SkinToneSelector />
                        {/snippet}
                      </EmojiPicker.Footer>
                    </Popover.Content>
                  </Popover.Root>
                </EmojiPicker.Root>
              </div>

              <div class="absolute right-3 flex h-full items-center">
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  class="text-primary hover:bg-primary/10 flex h-7 items-center justify-center sm:h-8"
                  disabled={!message.trim()}
                >
                  <SendHorizontal class="size-4 sm:size-5" />
                </Button>
              </div>
            </div>
          </form>
        {:else}
          <div
            class="bg-muted/50 border-muted flex flex-col items-center justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:p-4"
          >
            <p class="text-sm sm:text-base">You need to sign in to send messages in this room</p>
            <Button
              onclick={() => goto(`/sign-in?redirectTo=/room/r/${data.payload?.room.id}`)}
              class="flex w-full items-center gap-2 shadow-sm transition-all hover:shadow-md sm:w-auto"
              size="sm"
            >
              <LogIn class="size-4" />
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
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
