<script lang="ts">
  import { cn } from "$lib/utils";
  import { enhance } from "$app/forms";
  import { io } from "socket.io-client";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Chat from "$lib/components/ui/chat";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import * as Popover from "$lib/components/ui/popover";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch";
  import * as EmojiPicker from "$lib/components/ui/emoji-picker";
  import { UseAutoScroll } from "$lib/hooks/use-auto-scroll.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";

  let { data } = $props();
  let message = $state("");
  let emojiPickerOpen = $state(false);
  let loadingMoreMessages = $state(false);
  let allMessages = $state(data.payload?.messages.items || []);
  let currentPage = $state(data.payload?.messages.page || 1);
  let perPage = $state(data.payload?.messages.perPage || 10);
  let scrollContainer: HTMLElement | null = $state(null);
  let scrollHeight = 0;
  let scrollPosition = 0;
  let isAtBottom = $state(true);
  let socket = io("/");
  let connected = $state(false);
  let sendingMessage = $state(false);
  let processedEvents = $state(new Map<string, number>());

  const autoScroll = new UseAutoScroll();

  $effect(() => {
    if (data.status === 200 && data.payload?.room?.id) {
      socket.on("connect", () => {
        connected = true;
        const roomId = data.payload!.room.id;

        socket.emit("join_room", {
          roomId,
          userId: data.payload?.user?.id || null,
        });
      });

      socket.on("new_message", (newMsg: MessageItem) => {
        if (newMsg.roomId === data.payload!.room.id) {
          allMessages = [
            ...allMessages,
            {
              ...newMsg,
              user: {
                name: newMsg.userName || "Unknown",
              },
            },
          ];

          if (isAtBottom) {
            setTimeout(smoothScrollToBottom, 100);
          }
        }
      });

      socket.on("user_joined", (joinInfo: { roomId: string; name: string }) => {
        if (
          joinInfo.roomId === data.payload!.room.id &&
          joinInfo.name !== data.payload?.user?.name
        ) {
          const eventKey = `join:${joinInfo.roomId}:${joinInfo.name}`;
          const now = Date.now();

          const lastProcessed = processedEvents.get(eventKey);
          if (lastProcessed && now - lastProcessed < 5000) {
            return;
          }

          processedEvents.set(eventKey, now);

          toast.success(`${joinInfo.name} joined the room`, {
            description: formatTime(new Date()),
          });

          if (isAtBottom) {
            setTimeout(smoothScrollToBottom, 100);
          }
        }
      });

      socket.on("user_left", (leaveInfo: { roomId: string; username: string }) => {
        if (
          leaveInfo.roomId === data.payload!.room.id &&
          leaveInfo.username !== data.payload?.user?.name
        ) {
          const eventKey = `leave:${leaveInfo.roomId}:${leaveInfo.username}`;
          const now = Date.now();

          const lastProcessed = processedEvents.get(eventKey);
          if (lastProcessed && now - lastProcessed < 5000) {
            return;
          }

          processedEvents.set(eventKey, now);

          toast.success(`${leaveInfo.username} left the room`, {
            description: formatTime(new Date()),
          });

          if (isAtBottom) {
            setTimeout(smoothScrollToBottom, 100);
          }
        }
      });

      socket.on("disconnect", () => {
        connected = false;
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });

  function smoothScrollToBottom() {
    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  let hasMoreMessages = $derived((data.payload?.messages.totalPages || 0) > currentPage);

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

  function handleMessageSubmit() {
    if (!message.trim() || !data.payload?.user) return;

    sendingMessage = true;

    return async ({
      result,
    }: {
      result: { type: string; data?: { status: number; message: string; payload?: unknown } };
    }) => {
      sendingMessage = false;

      if (result.type === "success" && result.data?.status === 200) {
        message = "";
        smoothScrollToBottom();
      } else {
        toast.error("Failed to send message", {
          description: result.data?.message || "Please try again later",
        });
      }
    };
  }

  function checkIfAtBottom() {
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const scrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
    isAtBottom = scrolledToBottom;
  }

  type ActionResult = {
    type: string;
    data?: {
      status: number;
      message: string;
      payload: {
        messages: {
          totalItems: number;
          page: number;
          totalPages: number;
          perPage: number;
          items: MessageItem[];
        };
      };
    };
  };

  function handleLoadMoreMessages() {
    if (!data.payload?.room?.id || loadingMoreMessages || !hasMoreMessages) return;

    loadingMoreMessages = true;

    if (scrollContainer) {
      scrollHeight = scrollContainer.scrollHeight;
      scrollPosition = scrollContainer.scrollTop;
    }

    return async ({ result }: { result: ActionResult }) => {
      if (result.type === "success" && result.data?.status === 200) {
        const newMessages = result.data.payload.messages.items;
        allMessages = [...newMessages, ...allMessages];
        currentPage = result.data.payload.messages.page;
        setTimeout(() => {
          if (scrollContainer) {
            const newScrollHeight = scrollContainer.scrollHeight;
            const heightDifference = newScrollHeight - scrollHeight;
            scrollContainer.scrollTop = scrollPosition + heightDifference;
          }
        }, 0);
      }
      loadingMoreMessages = false;
    };
  }

  $effect(() => {
    if (data.status === 200 && data.payload?.messages.items.length) {
      allMessages = data.payload.messages.items;
      smoothScrollToBottom();
    }
  });

  type MessageUser = {
    name: string;
    id?: string;
  };

  type MessageItem = {
    id: string;
    content: string;
    created: string;
    userId?: string;
    user: MessageUser;
    collectionId: string;
    collectionName: string;
    expand?: Record<string, unknown>;
    roomId?: string;
    userName?: string;
  };
</script>

<svelte:head>
  {#if data.status != 200}
    <title>{data.status} | ping.</title>
  {:else}
    <title>{data.payload!.room.displayName || data.payload!.room.name} | ping.</title>
  {/if}
</svelte:head>

{#if data.status == 200}
  <Toaster />
  <div class="flex h-screen flex-col overflow-hidden">
    <div
      class="bg-background/95 supports-[backdrop-filter]:bg-background/60 z-10 border-b backdrop-blur"
    >
      <div class="mx-auto flex max-w-4xl items-center justify-between p-3 sm:p-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger
                onclick={() => goto("/room/list")}
                class={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex h-9 w-9 items-center justify-center",
                )}
              >
                <Lucide.ArrowLeft class="size-4" />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Explore rooms</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
          <div
            class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full sm:size-10"
          >
            <Lucide.MessageCircle class="size-4 sm:size-5" />
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
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <div
                  class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm"
                >
                  {#if data.payload?.user}
                    {data.payload?.user.name[0].toUpperCase()}
                  {:else}
                    <Lucide.UserX class="size-4" />
                  {/if}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content>
                {#if data.payload?.user}
                  <p>Signed in as {data.payload?.user.email}</p>
                {:else}
                  <p>You are currently not signed in</p>
                {/if}
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
                <Tooltip.Trigger
                  onclick={() => goto("/sign-out")}
                  class={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 w-9 rounded-md shadow-sm transition-shadow hover:shadow-md",
                  )}
                >
                  <Lucide.LogOut class="size-4" />
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
      <div class="relative mx-auto h-full w-full max-w-4xl">
        {#if !allMessages.length}
          <div
            class="flex h-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12"
          >
            <div class="bg-muted mb-4 rounded-full p-3 sm:p-4">
              <Lucide.MessageCircle class="text-muted-foreground size-6 sm:size-8" />
            </div>
            <h3 class="text-muted-foreground mb-2 text-base font-medium sm:text-lg">
              No messages yet
            </h3>
            <p class="text-muted-foreground max-w-md text-xs sm:text-sm">
              Be the first to start a conversation in this room!
            </p>
          </div>
        {:else}
          <div
            bind:this={scrollContainer}
            bind:this={autoScroll.ref}
            onscroll={checkIfAtBottom}
            class="relative h-full overflow-y-auto px-1 sm:px-2"
          >
            <Chat.List class="space-y-2 p-2 sm:space-y-3 sm:p-3 md:space-y-4 md:p-4">
              {#if hasMoreMessages}
                <div class="flex justify-center pb-4">
                  <form method="POST" action="?/load-more" use:enhance={handleLoadMoreMessages}>
                    <input type="hidden" name="roomId" value={data.payload!.room.id} />
                    <input type="hidden" name="page" value={currentPage + 1} />
                    <input type="hidden" name="perPage" value={perPage} />

                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2 rounded-full"
                      disabled={loadingMoreMessages}
                    >
                      {#if loadingMoreMessages}
                        <Lucide.Loader2 class="size-4 animate-spin" />
                        <span>Loading...</span>
                      {:else}
                        <Lucide.ChevronUpIcon class="size-4" />
                        <span>Load more</span>
                      {/if}
                    </Button>
                  </form>
                </div>
              {/if}

              {#each allMessages as msg, index (msg.id + "-" + index)}
                {@const isSentByMe =
                  data.payload?.user && msg.user && msg.user.name === data.payload.user.name}
                {@const username = msg.user?.name || "Unknown"}
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
                      {getInitials(username)}
                    </Chat.BubbleAvatarFallback>
                  </Chat.BubbleAvatar>
                  <Chat.BubbleMessage
                    class={cn(
                      "flex flex-col gap-1 rounded-2xl border px-3 py-2 shadow-sm sm:px-4 sm:py-2.5",
                      isSentByMe
                        ? "dark:bg-primary/5 border-primary/15"
                        : "bg-secondary dark:bg-secondary/60 border-secondary/15 text-foreground",
                    )}
                  >
                    <p class="text-sm leading-relaxed break-words sm:text-base dark:text-white">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags @typescript-eslint/no-explicit-any -->
                      {@html (msg as any).content ?? ""}
                    </p>
                    <div
                      class={cn(
                        "w-full text-xs italic opacity-60",
                        isSentByMe ? "text-end text-gray-200" : "text-foreground/70 text-start",
                      )}
                    >
                      <span class="font-bold">{username}</span>,
                      <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
                      {formatTime((msg as any).created ? new Date((msg as any).created) : null)}
                    </div>
                  </Chat.BubbleMessage>
                </Chat.Bubble>
              {/each}
            </Chat.List>
          </div>
        {/if}

        {#if !isAtBottom}
          <div
            class="pointer-events-none fixed right-0 bottom-20 left-0 z-10 flex justify-center sm:bottom-24"
          >
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  onclick={() => smoothScrollToBottom()}
                  class="bg-secondary text-secondary-foreground pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <Lucide.ChevronDownIcon class="size-5" />
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>Scroll to bottom</p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        {/if}
      </div>
    </div>

    <div
      class="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t px-3 py-2 backdrop-blur sm:px-4 sm:py-3 md:py-4"
    >
      <div class="mx-auto max-w-4xl">
        {#if data.payload?.user}
          <form
            method="POST"
            action="?/message"
            use:enhance={handleMessageSubmit}
            class="flex place-items-center"
          >
            <input type="hidden" name="userId" value={data.payload.user.id} />
            <input type="hidden" name="roomId" value={data.payload!.room.id} />
            <input type="hidden" name="content" value={message.trim()} />

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
                      <Lucide.SmilePlusIcon class="size-4 sm:size-5" />
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
                  disabled={!message.trim() || !connected || sendingMessage}
                >
                  {#if sendingMessage}
                    <Lucide.Loader2 class="size-4 animate-spin" />
                  {:else}
                    <Lucide.SendHorizontal class="size-4 sm:size-5" />
                  {/if}
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
              onclick={() => goto(`/sign-in?redirect-to=/room/r/${data.payload?.room.id}`)}
              class="flex w-full items-center gap-2 shadow-sm transition-all hover:shadow-md sm:w-auto"
              size="sm"
            >
              <Lucide.LogIn class="size-4" />
            </Button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card.Root class="w-full max-w-md">
      <Card.Content class="pt-6">
        <div class="flex flex-col items-center space-y-4 text-center">
          <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <Lucide.AlertCircle class="size-10 text-red-600 dark:text-red-400" />
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
      </Card.Content>
    </Card.Root>
  </div>
{/if}
