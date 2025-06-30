/*
	Installed from @ieedan/shadcn-svelte-extras
*/

import BubbleMessage from "./chat-bubble-message.svelte";
import BubbleAvatar from "./chat-bubble-avatar.svelte";
import * as Avatar from "$lib/components/ui/avatar";
import Bubble from "./chat-bubble.svelte";
import List from "./chat-list.svelte";

const BubbleAvatarImage = Avatar.Image;
const BubbleAvatarFallback = Avatar.Fallback;

export { List, Bubble, BubbleMessage, BubbleAvatar, BubbleAvatarImage, BubbleAvatarFallback };

export type * from "./types";
