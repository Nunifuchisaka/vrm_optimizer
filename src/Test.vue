<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(true)
</script>

<template>
<v-app>
      <v-main>
        <v-container>
          <v-row justify="center">
            <!-- ボタン押下でモーダルダイアログを開きます。 -->
            <v-btn @click.stop="dialog = true">ダイアログを開く</v-btn>
            <!--
              モーダルダイアログを定義します。
              persistentを指定するとモーダルになります。
            -->
            <v-dialog
              v-model="dialog"
              max-width="290"
              persistent>
              <v-card>
                <v-card-title>タイトル</v-card-title>
                <v-card-text>本文</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="dialog = false">閉じる</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>

<style lang="scss">

</style>