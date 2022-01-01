<script>
  import { loginUser, spotifyUser } from "../stores/spotifyStore.js";
  import { onMount } from "svelte";

  onMount(() => loginUser());
</script>

{#if $spotifyUser}
  <p>Logged in as {$spotifyUser.display_name}</p>
{/if}
