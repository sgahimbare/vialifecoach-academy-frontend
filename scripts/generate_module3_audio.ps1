Add-Type -AssemblyName System.Speech

$scriptPath = "C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\scripts\module3_video_script.txt"
$outPath = "C:\Users\Admin\Desktop\vialifecoach frontend\vialifecoach-frontend\public\videos\module3\emotional-regulation-and-cognitive-awareness.wav"

$text = (Get-Content -Path $scriptPath -Raw).Trim()
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$preferredVoices = @("Microsoft Zira Desktop", "Microsoft Hazel Desktop")
$installed = $synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }
$selected = $preferredVoices | Where-Object { $installed -contains $_ } | Select-Object -First 1
if ($selected) { $synth.SelectVoice($selected) }

$synth.Rate = 1
$synth.Volume = 100
$synth.SetOutputToWaveFile($outPath)
$synth.Speak($text)
$synth.SetOutputToNull()
$synth.Dispose()
Write-Output "Regenerated Module 3 narration: $outPath"
