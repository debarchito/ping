<script lang="ts">
  import type { PageProps } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import * as Pagination from "$lib/components/ui/pagination";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { LightSwitch } from "$lib/components/ui/light-switch";
  import {
    BellDot,
    Calendar,
    Plus,
    Search,
    Minus,
    X,
    MessageCircle,
    LogIn,
    LogOut,
  } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const { data }: PageProps = $props();
  let searchQuery = $state(data.search || "");

  const currentPage = $derived(data.page);
  const perPage = $derived(data.perPage);

  function handlePageChange(newPage: number) {
    const url = new URL(page.url);
    url.searchParams.set("p", newPage.toString());
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    }
    goto(url.toString());
  }

  function updatePerPage(newPerPage: number) {
    const url = new URL(page.url);
    url.searchParams.set("n", Math.max(1, newPerPage).toString());
    url.searchParams.set("p", "1");
    if (searchQuery) {
      url.searchParams.set("search", searchQuery);
    }
    goto(url.toString());
  }

  function adjustPerPage(delta: number) {
    updatePerPage(perPage + delta);
  }

  function handleSearch() {
    const url = new URL(page.url);
    url.searchParams.set("p", "1");
    if (searchQuery.trim()) {
      url.searchParams.set("search", searchQuery.trim());
    } else {
      url.searchParams.delete("search");
    }
    goto(url.toString());
  }

  function clearSearch() {
    searchQuery = "";
    const url = new URL(page.url);
    url.searchParams.set("p", "1");
    url.searchParams.delete("search");
    goto(url.toString());
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }
</script>

<svelte:head>
  <title>Explore rooms | ping.</title>
</svelte:head>

<div class="flex flex-col items-center justify-center gap-4 p-4 md:gap-6 md:p-10">
  <div class="flex w-full max-w-4xl flex-col gap-4 md:gap-6">
    <div class="flex items-center justify-between text-4xl font-medium select-none md:text-6xl">
      <a class="flex items-center gap-2" href="/">
        <div
          class="bg-primary text-primary-foreground flex size-6 transform items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105 md:size-8"
        >
          <BellDot class="size-3 md:size-5" />
        </div>
        <span class="font-ms-madi mr-2 mb-2 md:mr-4 md:mb-4">ping.</span>
      </a>

      <div class="flex items-center gap-2">
        {#if data.user}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <div
                  class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm"
                >
                  {data.user.name[0].toUpperCase()}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Signed in as {data.user.email}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {/if}

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <div class="flex h-9 items-center">
                <LightSwitch />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Switch theme</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        {#if data.user}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <div class="flex h-9 items-center">
                  <Button
                    onclick={() => goto("/sign-out")}
                    variant="outline"
                    class="h-9 w-9 rounded-md shadow-sm transition-shadow hover:shadow-md"
                  >
                    <LogOut class="size-4" />
                  </Button>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Sign out</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {:else}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button
                  onclick={() => goto("/sign-in")}
                  variant="outline"
                  class="h-9 w-9 rounded-md shadow-sm transition-shadow hover:shadow-md"
                >
                  <LogIn class="size-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Sign in</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {/if}
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="relative">
        <Search class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          bind:value={searchQuery}
          onkeydown={handleKeydown}
          placeholder="Search rooms by name or description..."
          class="h-12 pr-12 pl-10"
        />
        {#if searchQuery}
          <Button
            onclick={clearSearch}
            variant="ghost"
            size="icon"
            class="absolute top-1/2 right-3 size-6 -translate-y-1/2"
          >
            <X class="size-3" />
          </Button>
        {/if}
      </div>

      <div class="flex items-center justify-between gap-4">
        <Button
          class="flex flex-1 transform items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex-none"
        >
          <a href="/room/create" class="flex items-center gap-2">
            <Plus class="size-4" />
            Create Room
          </a>
        </Button>

        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-1 rounded-lg border p-1">
            <Button
              onclick={() => adjustPerPage(-1)}
              disabled={perPage <= 1}
              variant="ghost"
              size="icon"
              class="size-8"
            >
              <Minus class="size-3" />
            </Button>
            <span class="px-3 py-1 text-sm font-medium">
              {perPage} rooms
            </span>
            <Button onclick={() => adjustPerPage(1)} variant="ghost" size="icon" class="size-8">
              <Plus class="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each data.rooms as room (room.id)}
        <Card
          class="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <a href="/room/r/{room.id}" class="block h-full">
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between gap-2">
                <CardTitle
                  class="group-hover:text-primary flex min-w-0 flex-1 items-center gap-2 text-lg transition-colors"
                >
                  <MessageCircle class="size-4 flex-shrink-0" />
                  <span class="truncate">{room.displayName || room.name}</span>
                </CardTitle>
                <Badge variant="secondary" class="flex flex-shrink-0 items-center gap-1 text-xs">
                  <Calendar class="size-3" />
                  <span class="hidden sm:inline">
                    {new Date(room.created).toLocaleDateString()}
                  </span>
                  <span class="sm:hidden">
                    {new Date(room.created).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </Badge>
              </div>
              <CardDescription class="text-muted-foreground text-sm">
                r/{room.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm leading-relaxed">
                {room.description}
              </p>
            </CardContent>
          </a>
        </Card>
      {/each}
    </div>

    {#if data.totalPages > 1}
      <div class="mt-6 flex justify-center">
        <Pagination.Root count={data.totalItems} perPage={data.perPage} page={currentPage}>
          {#snippet children({ pages, currentPage: paginationCurrentPage })}
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.PrevButton
                  onclick={() => handlePageChange(paginationCurrentPage - 1)}
                  disabled={paginationCurrentPage === 1}
                />
              </Pagination.Item>
              {#each pages as page (page.key)}
                {#if page.type === "ellipsis"}
                  <Pagination.Item>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                {:else}
                  <Pagination.Item>
                    <Pagination.Link
                      {page}
                      isActive={paginationCurrentPage === page.value}
                      onclick={() => handlePageChange(page.value)}
                    >
                      {page.value}
                    </Pagination.Link>
                  </Pagination.Item>
                {/if}
              {/each}
              <Pagination.Item>
                <Pagination.NextButton
                  onclick={() => handlePageChange(paginationCurrentPage + 1)}
                  disabled={paginationCurrentPage === data.totalPages}
                />
              </Pagination.Item>
            </Pagination.Content>
          {/snippet}
        </Pagination.Root>
      </div>
    {/if}
  </div>
</div>
