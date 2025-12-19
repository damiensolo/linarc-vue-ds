<template>
    <div class="container mx-auto p-8 bg-bg-body min-h-screen">
        <Card>
            <CardHeader>
                <CardTitle>Floating Action Button</CardTitle>
                <CardDescription>
                    Floating Action Button component with different sizes and shapes from Figma design system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-8">
                    <!-- Circular FABs -->
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Circular Floating Action Buttons</h3>
                        <div class="flex items-center gap-6 flex-wrap">
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="XL" shape="Circle" />
                                <span class="text-sm text-muted-foreground">XL</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="L" shape="Circle" />
                                <span class="text-sm text-muted-foreground">L</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="M" shape="Circle" />
                                <span class="text-sm text-muted-foreground">M</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="S" shape="Circle" />
                                <span class="text-sm text-muted-foreground">S</span>
                            </div>
                        </div>
                    </div>

                    <!-- Square FABs -->
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Square Floating Action Buttons</h3>
                        <div class="flex items-center gap-6 flex-wrap">
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="XL" shape="Square" />
                                <span class="text-sm text-muted-foreground">XL</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="L" shape="Square" />
                                <span class="text-sm text-muted-foreground">L</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="M" shape="Square" />
                                <span class="text-sm text-muted-foreground">M</span>
                            </div>
                            <div class="flex flex-col items-center gap-2">
                                <FloatingActionButton size="S" shape="Square" />
                                <span class="text-sm text-muted-foreground">S</span>
                            </div>
                        </div>
                    </div>

                    <!-- Custom Icon Example -->
                    <div>
                        <h3 class="text-lg font-semibold mb-4">With Custom Content</h3>
                        <div class="flex items-center gap-6 flex-wrap">
                            <FloatingActionButton size="XL" shape="Circle">
                                <span class="text-2xl font-bold">+</span>
                            </FloatingActionButton>
                            <FloatingActionButton size="L" shape="Circle" :show-icon="false">
                                <span class="text-xl font-bold">+</span>
                            </FloatingActionButton>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    FloatingActionButton,
} from '@linarc/design-system'
</script>
