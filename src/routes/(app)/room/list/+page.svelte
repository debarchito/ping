<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";

  const { data } = $props();
  let searchQuery = $state(data.search || "");
  const currentPage = $derived(data.page);
  const perPage = $derived(data.perPage);

  function buildUrl(params: Record<string, string | number | null>) {
    const url = new URL(page.url);
    Object.entries(params).forEach(([key, value]) =>
      value != null ? url.searchParams.set(key, value.toString()) : url.searchParams.delete(key),
    );
    return url.toString();
  }

  function handlePageChange(newPage: number) {
    goto(buildUrl({ p: newPage, search: searchQuery.trim() || null }));
  }

  function updatePerPage(newPerPage: number) {
    goto(buildUrl({ n: Math.max(1, newPerPage), p: 1, search: searchQuery.trim() || null }));
  }

  function clearSearch() {
    searchQuery = "";
    goto(buildUrl({ p: 1, search: null }));
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      goto(buildUrl({ p: 1, search: searchQuery.trim() || null }));
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
          class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105 md:size-8"
        >
          <Lucide.BellDot class="size-3 md:size-5" />
        </div>
        <span class="font-ms-madi mr-2 mb-2 md:mr-4 md:mb-4">ping.</span>
      </a>

      <div class="flex items-center gap-2">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <div
                class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm"
              >
                {#if data.user}
                  {data.user.name[0].toUpperCase()}
                {:else}
                  <Lucide.UserX class="size-4" />
                {/if}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                {data.user ? `Signed in as @${data.user.name}` : "You are currently not signed in"}
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger
              ><div class="flex h-9 items-center"><LightSwitch /></div></Tooltip.Trigger
            >
            <Tooltip.Content><p>Switch theme</p></Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <div class="flex h-9 items-center">
                <Button
                  onclick={() => goto(data.user ? "/sign-out" : "/sign-in")}
                  variant="outline"
                  class="h-9 w-9 rounded-md shadow-sm transition-shadow hover:shadow-md"
                >
                  {#if data.user}
                    <Lucide.LogOut class="size-4" />
                  {:else}
                    <Lucide.LogIn class="size-4" />
                  {/if}
                </Button>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content><p>{data.user ? "Sign out" : "Sign in"}</p></Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="relative">
        <Lucide.Search
          class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
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
            <Lucide.X class="size-3" />
          </Button>
        {/if}
      </div>

      <div class="flex items-center justify-between gap-4">
        <Button
          class="flex flex-1 items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl md:flex-none"
        >
          <a href="/room/create" class="flex items-center gap-2">
            <Lucide.Plus class="size-4" />
            Create Room
          </a>
        </Button>

        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-1 rounded-lg border p-1">
            <Button
              onclick={() => updatePerPage(perPage - 1)}
              disabled={perPage <= 1}
              variant="ghost"
              size="icon"
              class="size-8"
            >
              <Lucide.Minus class="size-3" />
            </Button>
            <span class="px-3 py-1 text-sm font-medium">{perPage} rooms</span>
            <Button
              onclick={() => updatePerPage(perPage + 1)}
              variant="ghost"
              size="icon"
              class="size-8"
            >
              <Lucide.Plus class="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    {#if !data.rooms.length}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="bg-muted mb-4 rounded-full p-3 sm:p-4">
          <Lucide.MessageCircle class="text-muted-foreground size-6 sm:size-8" />
        </div>
        <h3 class="text-muted-foreground mb-2 text-base font-medium sm:text-lg">No rooms found</h3>
        <p class="text-muted-foreground max-w-md text-xs sm:text-sm">
          {searchQuery
            ? "No rooms match your search criteria. Try a different search or"
            : "Create a new room to get started or"} check back later for new rooms.
        </p>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.rooms as room (room.id)}
          <Card.Root
            class="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <a href={`/room/r/${room.id}`} class="block h-full">
              <Card.CardHeader class="pb-3">
                <div class="flex items-start justify-between gap-2">
                  <Card.CardTitle
                    class="group-hover:text-primary flex min-w-0 flex-1 items-center gap-2 text-lg transition-colors"
                  >
                    <Lucide.MessageCircle class="size-4 flex-shrink-0" />
                    <span class="block max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                      {room.displayName || room.name}
                    </span>
                  </Card.CardTitle>
                </div>
                <Card.CardDescription class="text-muted-foreground truncate text-sm">
                  r/{room.id}
                </Card.CardDescription>
              </Card.CardHeader>
              <Card.CardContent>
                <p class="line-clamp-3 text-sm leading-relaxed overflow-ellipsis">
                  {room.description}
                </p>
              </Card.CardContent>
            </a>
          </Card.Root>
        {/each}
      </div>
    {/if}

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
                <Pagination.Item>
                  {#if page.type === "ellipsis"}
                    <Pagination.Ellipsis />
                  {:else}
                    <Pagination.Link
                      {page}
                      isActive={paginationCurrentPage === page.value}
                      onclick={() => handlePageChange(page.value)}
                    >
                      {page.value}
                    </Pagination.Link>
                  {/if}
                </Pagination.Item>
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
