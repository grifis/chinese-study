<script lang="ts">
 import {base} from '$app/paths';import '../app.css'; let {children}=$props();</script>
<a class="skip" href="#main">本文へ移動</a>
<header class="site-header"><a href={`${base}/`} class="brand"><span class="brand-icon" lang="zh-Hans">学</span><span>ことばのノート<small>CHINESE STUDY</small></span></a><span class="header-caption">漢語会話301句</span></header>
<main id="main">{@render children()}</main>
<footer>毎日、少しずつ。<br/>教科書原文と学習補足を区別して学べる中国語ノート</footer>
