

import librosa



if __name__ == "__main__":
    a = "/home/jokandre/Documents/Projects/PlayMix/audio/Matias Damasio - Voltei com Ela-pRYrXfIlf58.mp3"
    b = "/home/jokandre/Documents/Projects/PlayMix/audio/Cubitaa Tks - Me Fala-dGhhm-WmKO4.mp3"
    c = "/home/jokandre/Documents/Projects/PlayMix/audio/Filho do Zua - Ditado Ft. Carla Prata (Video Oficial)-pZWZ48TMLcQ.mp3"
    for song in [a,b,c]:
        y, sr = librosa.load(song, sr=44100)
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
        print(tempo)

